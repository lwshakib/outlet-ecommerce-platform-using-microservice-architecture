import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Auth Service is running!" });
});

// Auth routes would go here
app.get("/api/auth/health", (req, res) => {
  res.json({ status: "Auth Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});