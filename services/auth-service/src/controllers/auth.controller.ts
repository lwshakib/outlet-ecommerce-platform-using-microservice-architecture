import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token";
import { sendEmailGrpc } from "../grpc/email.client";
import { sendToQueue } from "../rabbitmq";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3003";

const recordLoginHistory = async (userId: string, req: Request, status: "SUCCESS" | "FAILED", method: string) => {
  await prisma.loginHistory.create({
    data: {
      userId,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      status,
      method,
    },
  });
};

const createSession = async (userId: string, req: Request) => {
  const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
  
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 days

  const session = await prisma.session.create({
    data: {
      userId,
      token: sessionToken,
      expires,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    },
  });

  const accessToken = generateAccessToken({ userId, sessionId: session.id });
  const refreshToken = generateRefreshToken({ userId, sessionId: session.id, token: sessionToken });

  return { session, accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
      },
    });

    // Create user in user-service
    try {
      await fetch(`${USER_SERVICE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: name || email.split("@")[0],
        }),
      });
    } catch (err) {
      console.error("Failed to create user in user-service:", err);
    }

    // Send verification email via gRPC
    try {
      await sendEmailGrpc(email, "Verify your email", `Your verification code is: ${verificationCode}`);
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    res.status(201).json({
      message: "Verification email sent. Please verify your email to log in.",
      email: user.email,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationCode: null },
    });

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      await recordLoginHistory(user.id, req, "FAILED", "EMAIL");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
       return res.status(403).json({ error: "Please verify your email first" });
    }

    const { session, accessToken, refreshToken } = await createSession(user.id, req);
    
    const loginHistoryCount = await prisma.loginHistory.count({ where: { userId: user.id, status: "SUCCESS" } });
    
    // Send welcome email on first successful login (or strictly first time)
    // Here logic is simplified: if no previous history, send welcome.
    if (loginHistoryCount === 0) {
       sendToQueue({
          to: email,
          subject: "Welcome to Outlet Ecommerce",
          body: "Welcome to our platform! We are excited to have you on board."
       });
    }

    await recordLoginHistory(user.id, req, "SUCCESS", "EMAIL");

    res.json({
      accessToken,
      refreshToken,
      sessionToken: session.token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const payload: any = verifyRefreshToken(refreshToken);
    
    const session = await prisma.session.findFirst({
      where: { 
        token: payload.token, 
        isActive: true, 
        expires: { gt: new Date() } 
      },
      include: { user: true },
    });

    if (!session) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    const newAccessToken = generateAccessToken({ userId: session.userId, sessionId: session.id });
    const newRefreshToken = generateRefreshToken({ 
      userId: session.userId, 
      sessionId: session.id, 
      token: session.token 
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionToken: session.token,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.body;
    if (sessionToken) {
      await prisma.session.updateMany({
        where: { token: sessionToken },
        data: { isActive: false },
      });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
