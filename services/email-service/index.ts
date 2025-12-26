import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Email Service is running!" });
});

// Email service routes would go here
app.get("/api/email/health", (req, res) => {
  res.json({ status: "Email Service is healthy" });
});

// Placeholder for email sending functionality
app.post("/api/email/send", (req, res) => {
  const { to, subject, body } = req.body;
  console.log(`Email sent to: ${to}, Subject: ${subject}`);
  res.json({ message: "Email sent successfully", success: true });
});

app.listen(PORT, () => {
  console.log(`Email service listening on port ${PORT}`);
});