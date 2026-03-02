import type { Request, Response, NextFunction } from "express";
import redis from "../lib/redis";
import logger from "../logger/winston.logger";
import { prisma } from "../lib/prisma";

const CART_EXPIRY = parseInt(process.env.CART_EXPIRY || "900");

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const cartData = await redis.get(`cart:${sessionId}`);
    res.json(cartData ? JSON.parse(cartData) : { items: [] });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    // 1. Check stock
    const inventory = await prisma.inventory.findUnique({
        where: { productId }
    });
    
    if (!inventory || inventory.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // 2. Decrease stock
    await prisma.inventory.update({
        where: { productId },
        data: {
            stock: {
                decrement: quantity
            }
        }
    });

    // 3. Get product info for cart display
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { company: true }
    });
    
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    // 4. Update cart in Redis
    const cartKey = `cart:${sessionId}`;
    const shadowKey = `shadow:cart:${sessionId}`;
    
    let cart: any = await redis.get(cartKey);
    cart = cart ? JSON.parse(cart) : { items: [] };

    const existingItem = cart.items.find((i: any) => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ 
        productId, 
        companyId: product.companyId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images?.[0]
      });
    }

    await redis.set(cartKey, JSON.stringify(cart));
    await redis.setex(shadowKey, CART_EXPIRY, "expiring");

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sessionId, productId, quantity } = req.body;
        
        const cartKey = `cart:${sessionId}`;
        let cart: any = await redis.get(cartKey);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        cart = JSON.parse(cart);

        const itemIndex = cart.items.findIndex((i: any) => i.productId === productId);
        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

        const removeQty = quantity || cart.items[itemIndex].quantity;
        
        // Return to inventory
        await prisma.inventory.update({
            where: { productId },
            data: {
                stock: {
                    increment: removeQty
                }
            }
        });

        cart.items[itemIndex].quantity -= removeQty;
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }

        if (cart.items.length === 0) {
            await redis.del(cartKey);
            await redis.del(`shadow:cart:${sessionId}`);
        } else {
            await redis.set(cartKey, JSON.stringify(cart));
        }

        res.json(cart);
    } catch (error) {
        next(error);
    }
};

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sessionId } = req.body;
        // Logic for clear cart
        await redis.del(`cart:${sessionId}`);
        await redis.del(`shadow:cart:${sessionId}`);
        res.json({ message: "Checkout successful, cart cleared" });
    } catch (error) {
        next(error);
    }
};
