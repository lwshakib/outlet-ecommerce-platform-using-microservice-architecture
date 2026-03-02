import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import productRoutes from "./src/routes/product.routes";
import inventoryRoutes from "./src/routes/inventory.routes";
import cartRoutes from "./src/routes/cart.routes";
import { startGrpcServer } from "./src/grpc/product.server";
import { startCartListener } from "./src/services/cart.listener";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (req, res) => {
  res.json({ status: "Product Service is healthy" });
});

app.use("/", productRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/cart", cartRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Product Service listening on port ${PORT}`);
  startGrpcServer();
  startCartListener();
});