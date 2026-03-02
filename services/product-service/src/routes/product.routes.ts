import { Router } from "express";
import { 
  getAllProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct,
  createCompany, 
  getCompaniesByOwner,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  getAllCategories,
  createCategory
} from "../controllers/product.controller";

const router = Router();

// Product routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Category routes
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);


// Company routes
router.post("/companies", createCompany);
router.get("/companies", getAllCompanies);
router.get("/companies/owner/:ownerId", getCompaniesByOwner);
router.get("/companies/:id", getCompanyById);
router.patch("/companies/:id", updateCompany);

export default router;
