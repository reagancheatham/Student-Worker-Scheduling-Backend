import { Router } from "express";
import scheduleTemplateController from "../controllers/scheduleTemplate.controller.ts";

const router = Router();

router.post("/", scheduleTemplateController.create);
router.put("/", scheduleTemplateController.update);
router.delete("/:id", scheduleTemplateController.delete);
router.get("/:id", scheduleTemplateController.get);
router.get("/", scheduleTemplateController.getAll);

export default router;
