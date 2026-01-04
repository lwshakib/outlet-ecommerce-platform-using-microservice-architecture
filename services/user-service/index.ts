import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.routes";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "User Service is healthy" });
});

// User routes
app.use("/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`User service listening on port ${PORT}`);
});