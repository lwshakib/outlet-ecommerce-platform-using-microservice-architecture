import express, { Router } from "express";
import { 
  createCheckoutSession, 
  handleWebhook 
} from "../controllers/payment.controller";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);

// Note: This webhook route needs the raw body
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
