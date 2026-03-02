import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import orderRoutes from "./src/routes/order.routes";
import paymentRoutes from "./src/routes/payment.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());

// Conditional express.json() for Stripe webhook
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(morganMiddleware);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Order Service is healthy" });
});

app.use("/", orderRoutes);
app.use("/", paymentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Order Service listening on port ${PORT}`);
});