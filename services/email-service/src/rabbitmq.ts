import amqp from "amqplib";
import { sendEmail } from "./mailer";
import logger from "./logger/winston.logger";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "email_queue";

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    logger.info(`[*] Waiting for messages in ${QUEUE_NAME}. To exit press CTRL+C`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info(" [x] Received from RabbitMQ:", content);

          const { to, subject, body } = content;
          await sendEmail({ to, subject, body, method: "RABBITMQ" });

          channel.ack(msg);
        } catch (error) {
          logger.error("Error processing RabbitMQ message:", error);
          // Depending on the error, you might want to nack or handle it differently
          channel.nack(msg, false, false); // For now, just discard if JSON is malformed
        }
      }
    });

    return connection;
  } catch (error) {
    logger.error("RabbitMQ connection error:", error);
    // In a real app, you might want to retry connection
  }
}
