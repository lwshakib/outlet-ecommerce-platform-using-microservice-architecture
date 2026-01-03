import "dotenv/config";
import express from "express";
import cors from "cors";
import { sendEmail } from "./src/mailer";
import { connectRabbitMQ } from "./src/rabbitmq";
import { startGRPCServer } from "./src/grpc";
import { prisma } from "./src/db";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Email Service is healthy" });
});

// API endpoint to send email
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields: to, subject, body" });
    }

    const result = await sendEmail({ to, subject, body, method: "API" });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Get email history
app.get("/history", async (req, res) => {
  try {
    const emails = await prisma.email.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(emails);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Start RabbitMQ consumer
connectRabbitMQ();

// Start gRPC server
startGRPCServer();

app.listen(PORT, () => {
  console.log(`Email service API listening on port ${PORT}`);
});