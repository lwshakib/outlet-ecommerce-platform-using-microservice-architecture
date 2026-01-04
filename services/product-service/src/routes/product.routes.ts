import { Router } from "express";
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  createCompany, 
  getCompaniesByOwner 
} from "../controllers/product.controller";

const router = Router();

// Product routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);

// Company routes
router.post("/companies", createCompany);
router.get("/companies/owner/:ownerId", getCompaniesByOwner);

export default router;
