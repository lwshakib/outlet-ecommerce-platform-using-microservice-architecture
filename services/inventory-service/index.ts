import express from "express";
import cors from "cors";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import { prisma } from "./src/db";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Inventory Service is running!" });
});

// Update stock
app.post("/stock", async (req, res) => {
  try {
    const { productId, stock, location } = req.body;
    const inventory = await prisma.inventory.upsert({
      where: { productId },
      update: { stock, location },
      create: { productId, stock, location }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stock
app.get("/stock/:productId", async (req, res) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { productId: req.params.productId }
    });
    if (!inventory) return res.status(404).json({ error: "Inventory not found" });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Adjust stock (atomic)
app.post("/stock/adjust", async (req, res) => {
  try {
    const { productId, adjustment } = req.body; // adjustment can be positive or negative
    const inventory = await prisma.inventory.update({
      where: { productId },
      data: {
        stock: {
          increment: adjustment
        }
      }
    });
    res.json(inventory);
  } catch (error) {
    logger.error("Error adjusting stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stock for multiple products
app.post("/stock/batch", async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) return res.status(400).json({ error: "productIds must be an array" });
    
    const inventory = await prisma.inventory.findMany({
      where: { productId: { in: productIds } }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Inventory service listening on port ${PORT}`);
});
