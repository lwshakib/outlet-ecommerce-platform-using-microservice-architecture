import amqp from "amqplib";
import logger from "./logger/winston.logger";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "email_queue";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    logger.info("Connected to RabbitMQ");
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ:", error);
  }
};

export const sendToQueue = (message: object) => {
  if (!channel) {
    logger.error("RabbitMQ channel not initialized");
    return;
  }
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
  logger.info("Message sent to RabbitMQ:", message);
};
