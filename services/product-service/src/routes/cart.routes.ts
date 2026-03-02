import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  checkout
} from "../controllers/cart.controller";

const router = Router();

router.get("/:sessionId", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/checkout", checkout);

export default router;
