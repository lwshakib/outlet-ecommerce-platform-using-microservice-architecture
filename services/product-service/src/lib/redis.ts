import Redis from "ioredis";
import logger from "../logger/winston.logger";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error("Redis error:", err);
});

// Enable keyspace notifications for expired events
redis.config("SET", "notify-keyspace-events", "Ex").catch(err => {
    logger.error("Failed to set redis config:", err);
});

export default redis;

export const redisSub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
