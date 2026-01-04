import "dotenv/config";
import express from "express";
import cors from "cors";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import paymentRoutes from "./src/routes/payment.routes";

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());

// Webhook route needs to bypass global json() middleware
app.use("/", (req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(morganMiddleware);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Payment Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Payment Service is healthy" });
});

// Routes
app.use("/", paymentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Payment service listening on port ${PORT}`);
});
