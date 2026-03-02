import { Router } from "express";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  getOrdersByCompany
} from "../controllers/order.controller";

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id", updateOrderStatus);
router.get("/company/:companyId", getOrdersByCompany);

export default router;
