import { Router } from "express";
import { signup, signin, refresh, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
