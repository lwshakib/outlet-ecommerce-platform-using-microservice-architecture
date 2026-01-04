import "dotenv/config";
import express from "express";
import cors from "cors";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import orderRoutes from "./src/routes/order.routes";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);


app.get("/health", (req, res) => {
  res.json({ status: "Order Service is healthy" });
});

// Routes
app.use("/", orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Order service listening on port ${PORT}`);
});
