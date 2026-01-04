import "dotenv/config";
import type { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../db";
import logger from "../logger/winston.logger";

if (!process.env.STRIPE_SECRET_KEY) {
  logger.error("STRIPE_SECRET_KEY is missing from environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key", {
  apiVersion: "2025-01-27.acacia",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { orderId, items, successUrl, cancelUrl } = req.body;

    if (!orderId || !items || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        orderId,
      },
    });

    await prisma.payment.upsert({
      where: { orderId },
      update: {
        stripeSessionId: session.id,
        status: "PENDING",
      },
      create: {
        orderId,
        stripeSessionId: session.id,
        amount: items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
        status: "PENDING",
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    logger.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret || "");
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: "SUCCESS" },
      });

      // Notify Order Service to update status to PAID
      try {
        await fetch(`${process.env.ORDER_SERVICE_URL || "http://localhost:3007"}/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        });
      } catch (err) {
        logger.error("Failed to update order status in order-service:", err);
      }
    }
  }

  res.json({ received: true });
};
