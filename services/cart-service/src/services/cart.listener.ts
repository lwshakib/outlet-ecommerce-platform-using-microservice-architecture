import { redisSub } from "../lib/redis";
import redis from "../lib/redis";
import logger from "../logger/winston.logger";
import axios from "axios";

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:3005";

export const startCartListener = () => {
    // Subscribe to expired events
    // The format is __keyevent@0__:expired
    const expiredChannel = "__keyevent@0__:expired";
    
    redisSub.subscribe(expiredChannel, (err) => {
        if (err) {
            logger.error("Failed to subscribe to Redis expired events:", err);
            return;
        }
        logger.info("Subscribed to Redis expired events");
    });

    redisSub.on("message", async (channel, key) => {
        if (channel === expiredChannel && key.startsWith("shadow:cart:")) {
            const sessionId = key.replace("shadow:cart:", "");
            logger.info(`Cart expired for session: ${sessionId}`);
            
            // Get the actual cart data
            const cartKey = `cart:${sessionId}`;
            const cartDataRaw = await redis.get(cartKey);
            
            if (cartDataRaw) {
                const cart = JSON.parse(cartDataRaw);
                logger.info(`Returning items to inventory for session: ${sessionId}`, cart.items);
                
                // Return items to inventory
                for (const item of cart.items) {
                    try {
                        await axios.post(`${INVENTORY_SERVICE_URL}/stock/adjust`, {
                            productId: item.productId,
                            adjustment: item.quantity
                        });
                        logger.info(`Returned ${item.quantity} of ${item.productId} to inventory`);
                    } catch (error) {
                        logger.error(`Failed to return ${item.productId} to inventory:`, error);
                    }
                }
                
                // Cleanup the main cart key
                await redis.del(cartKey);
            }
        }
    });
};
