import { Router } from "express";
import { createUser, getUser, updateUserProfile } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUserProfile);

export default router;
