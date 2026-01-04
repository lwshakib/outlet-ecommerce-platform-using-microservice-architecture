import express from "express";
import cors from "cors";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Order Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Order Service is healthy" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Order service listening on port ${PORT}`);
});
