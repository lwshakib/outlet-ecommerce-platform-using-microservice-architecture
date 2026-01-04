import nodemailer from "nodemailer";
import { prisma } from "./db";
import logger from "./logger/winston.logger";

// For development, you can use ethereal.email or a real SMTP server
// These should ideally be in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "user",
    pass: process.env.SMTP_PASS || "pass",
  },
});

export async function sendEmail({
  to,
  subject,
  body,
  method,
}: {
  to: string;
  subject: string;
  body: string;
  method: "API" | "RABBITMQ" | "GRPC";
}) {
  try {
    const info = await transporter.sendMail({
      from: '"Outlet Ecommerce" <no-reply@outlet.com>',
      to,
      subject,
      text: body,
      html: `<div>${body}</div>`,
    });

    logger.info(`Message sent: ${info.messageId}`);

    // Save to DB
    await prisma.email.create({
      data: {
        to,
        subject,
        body,
        status: "SENT",
        method,
      },
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    logger.error("Error sending email:", error);

    // Save to DB as FAILED
    await prisma.email.create({
      data: {
        to,
        subject,
        body,
        status: "FAILED",
        method,
      },
    });

    throw error;
  }
}
