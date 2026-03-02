import { Router } from "express";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/payment.controller";
import express from "express";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);
// Stripe webhook needs raw body
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
