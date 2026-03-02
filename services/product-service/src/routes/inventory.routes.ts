import { Router } from "express";
import {
  updateStock,
  getStock,
  adjustStock,
  getBatchStock
} from "../controllers/inventory.controller";

const router = Router();

router.post("/stock", updateStock);
router.get("/stock/:productId", getStock);
router.post("/stock/adjust", adjustStock);
router.post("/stock/batch", getBatchStock);

export default router;
