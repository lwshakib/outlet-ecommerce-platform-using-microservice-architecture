import { Router } from "express";
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  createCompany, 
  getCompaniesByOwner,
  getCompanyById,
  getAllCompanies,
  updateCompany
} from "../controllers/product.controller";

const router = Router();

// Product routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);

// Company routes
router.post("/companies", createCompany);
router.get("/companies", getAllCompanies);
router.get("/companies/owner/:ownerId", getCompaniesByOwner);
router.get("/companies/:id", getCompanyById);
router.patch("/companies/:id", updateCompany);

export default router;
