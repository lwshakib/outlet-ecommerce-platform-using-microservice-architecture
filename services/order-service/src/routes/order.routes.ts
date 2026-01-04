import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrdersByCompany,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/company/:companyId", getOrdersByCompany);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

export default router;
