import type { Request, Response } from "express";
import { prisma } from "../db";
import logger from "../logger/winston.logger";

export const createOrder = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const orders = await prisma.order.findMany({
      where: { userId: String(userId) },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error: any) {
    logger.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error: any) {
    logger.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error: any) {
    logger.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrdersByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: { companyId }
        }
      },
      include: {
        items: {
          where: { companyId }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error: any) {
    logger.error("Error fetching company orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
