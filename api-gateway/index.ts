import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

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

// Placeholder routes for microservices
app.all("/api/auth/*", (req, res) => {
  res.json({ message: "Auth service route placeholder" });
});

app.all("/api/email/*", (req, res) => {
  res.json({ message: "Email service route placeholder" });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});