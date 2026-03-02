import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import logger from "../logger/winston.logger";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, items, shippingAddress, totalAmount } = req.body;

    if (!userId || !items || !shippingAddress || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            companyId: item.companyId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(order);
  } catch (error: any) {
    logger.error("Error creating order:", error);
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required and must be a string" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error: any) {
    logger.error("Error fetching orders:", error);
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error: any) {
    logger.error("Error fetching order:", error);
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error: any) {
    logger.error("Error updating order status:", error);
    next(error);
  }
};

export const getOrdersByCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.params.companyId;
    
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: { companyId: companyId as string }
        }
      },
      include: {
        items: {
          where: { companyId: companyId as string }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error: any) {
    logger.error("Error fetching company orders:", error);
    next(error);
  }
};
