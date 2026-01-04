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

// Get all products with categories & search
app.get("/products", async (req, res) => {
  try {
    const { q } = req.query;
    
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: String(q), mode: 'insensitive' } },
        { description: { contains: String(q), mode: 'insensitive' } },
        { companyName: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
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

// Get products by company
app.get("/products/company/:companyId", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { companyId: req.params.companyId },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create product
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, images, categoryId, companyId, companyName, initialStock } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        images,
        categoryId,
        companyId,
        companyName,
      }
    });

    // Notify inventory-service to create stock entry
    try {
      await fetch(process.env.INVENTORY_SERVICE_URL || "http://localhost:3005/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: initialStock || 0 })
      });
    } catch (err) {
      logger.error("Failed to create inventory entry:", err);
    }

    res.status(201).json(product);
  } catch (error) {
    logger.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    const { name, description, price, images, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, description, price, images, categoryId }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
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
