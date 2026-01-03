import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Auth Service is healthy" });
});

// Auth routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});