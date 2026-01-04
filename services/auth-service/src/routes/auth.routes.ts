import { Router } from "express";
import { signup, signin, refresh, logout, verifyEmail, forgotPassword, resetPassword, getUsers, deleteUser } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/signin", signin);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User management (Ideally protected by isAdmin middleware)
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

export default router;
