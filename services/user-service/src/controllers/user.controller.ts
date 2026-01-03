import type { Request, Response } from "express";
import { prisma } from "../db";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { id, email, name } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "ID and email are required" });
    }

    const user = await prisma.user.create({
      data: {
        id,
        email,
        name,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
