import { Router } from "express";
import userController from "../controllers/user.controller.ts";

const router = Router();

router.post("/", userController.create);
router.put("/", userController.update);
router.delete("/:id", userController.delete);
router.get("/:id", userController.find);

export default router;
