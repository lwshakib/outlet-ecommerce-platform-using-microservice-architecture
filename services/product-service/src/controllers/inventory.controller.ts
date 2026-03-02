import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import logger from "../logger/winston.logger";

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, stock, location } = req.body;
    const inventory = await prisma.inventory.upsert({
      where: { productId },
      update: { stock, location },
      create: { productId, stock, location }
    });
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

export const getStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const inventory = await prisma.inventory.findUnique({
      where: { productId }
    });
    if (!inventory) return res.status(404).json({ error: "Inventory not found" });
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, adjustment } = req.body;
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
    next(error);
  }
};

export const getBatchStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) return res.status(400).json({ error: "productIds must be an array" });
    
    const inventory = await prisma.inventory.findMany({
      where: { productId: { in: productIds } }
    });
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};
