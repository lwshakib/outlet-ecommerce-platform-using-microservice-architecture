import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Auth Service is healthy" });
});

// Auth routes
app.use("/", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});