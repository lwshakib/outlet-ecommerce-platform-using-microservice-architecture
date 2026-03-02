import "dotenv/config";
import express from "express";
import cors from "cors";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import orderRoutes from "./src/routes/order.routes";
import paymentRoutes from "./src/routes/payment.routes";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
// Payment webhook needs raw body, we handle it in the router
// but we must avoid express.json() for that specific route if it's placed here.
// Alternatively, we can use a regex to exclude the webhook path from express.json()
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(morganMiddleware);


app.get("/health", (req, res) => {
  res.json({ status: "Order Service is healthy" });
});

// Routes
app.use("/", orderRoutes);
app.use("/", paymentRoutes);




app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Order service listening on port ${PORT}`);
});
