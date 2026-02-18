import { Router } from "express";
import shiftTemplateController from "../controllers/shiftTemplate.controller.ts";

const router = Router();

router.post("/", shiftTemplateController.create);
router.put("/", shiftTemplateController.update);
router.delete("/:id", shiftTemplateController.delete);
router.get("/:id", shiftTemplateController.find);

export default router;
