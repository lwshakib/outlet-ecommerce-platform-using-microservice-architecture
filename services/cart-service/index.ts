import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morganMiddleware from "./src/middlewares/morgan.middleware";
import { errorHandler } from "./src/middlewares/error.middleware";
import logger from "./src/logger/winston.logger";
import redis from "./src/lib/redis";
import { startCartListener } from "./src/services/cart.listener";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:3005";
const CART_EXPIRY = parseInt(process.env.CART_EXPIRY || "900"); // 15 minutes

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Start Redis listener
startCartListener();

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Cart Service is running!" });
});

// Get cart
app.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cartData = await redis.get(`cart:${sessionId}`);
    res.json(cartData ? JSON.parse(cartData) : { items: [] });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add to cart
app.post("/add", async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    // 1. Check stock
    const stockRes = await axios.get(`${INVENTORY_SERVICE_URL}/stock/${productId}`);
    if (stockRes.data.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // 2. Decrease stock
    await axios.post(`${INVENTORY_SERVICE_URL}/stock/adjust`, {
      productId,
      adjustment: -quantity
    });

    // 3. Get product info for cart display
    const catRes = await axios.get(`${process.env.CATALOG_SERVICE_URL || "http://localhost:3004"}/products/${productId}`);
    const product = catRes.data;

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
        quantity,
        name: product.name,
        price: product.price,
        image: product.images?.[0]
      });
    }

    await redis.set(cartKey, JSON.stringify(cart));
    // Set/Refresh TTL of shadow key (15 mins)
    await redis.setex(shadowKey, CART_EXPIRY, "expiring");

    res.json(cart);
  } catch (error: any) {
    logger.error("Add to cart error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove from cart (manual)
app.post("/remove", async (req, res) => {
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
        await axios.post(`${INVENTORY_SERVICE_URL}/stock/adjust`, {
            productId,
            adjustment: removeQty
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
        res.status(500).json({ error: "Internal server error" });
    }
});

// Checkout (buy)
app.post("/checkout", async (req, res) => {
    try {
        const { sessionId } = req.body;
        // Logic for actual order creation would be here
        // For now, we just clear the cart WITHOUT returning items to inventory
        await redis.del(`cart:${sessionId}`);
        await redis.del(`shadow:cart:${sessionId}`);
        res.json({ message: "Checkout successful, cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Cart service listening on port ${PORT}`);
});
