import { Router } from "express";
import roleController from "../controllers/role.controller.ts";

const router = Router();

router.post("/", roleController.create);
router.put("/", roleController.update);
router.delete("/:id", roleController.delete);
router.get("/:id", roleController.find);

export default router;
