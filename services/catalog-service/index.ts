import express from "express";
import cors from "cors";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";

import { prisma } from "./src/db";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Catalog Service is running!" });
});

// Get all products with categories
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    // Format for outlet-web (it expects product.company.name)
    const formattedProducts = products.map(p => ({
      ...p,
      company: { name: p.companyName || "Unknown Brand" }
    }));
    res.json(formattedProducts);
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get product details
app.get("/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    res.json({
      ...product,
      company: { name: product.companyName || "Unknown Brand" }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Catalog service listening on port ${PORT}`);
});
