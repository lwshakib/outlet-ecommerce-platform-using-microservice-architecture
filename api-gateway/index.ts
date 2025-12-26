import cors from "cors";

import proxy from "express-http-proxy";

import express from "express";

import morgan from "morgan";

import rateLimit from "express-rate-limit";

import swaggerUi from "swagger-ui-express";

import axios from "axios";

import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: {
    error: "Too many requests, please try again later!",
  },
  standardHeaders: true,
  legacyHeaders: true,
});

app.use(limiter);
app.use(morgan("combined"));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "API Gateway is running!" });
});

// API Gateway routes would go here
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway is healthy" });
});

// Proxy routes for microservices
app.use("/auth", proxy("http://localhost:3001")); // auth-service
app.use("/email", proxy("http://localhost:3002")); // email-service

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});