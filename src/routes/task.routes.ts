import { Router } from "express";
import taskController from "../controllers/task.controller.ts";

const router = Router();

router.post("/", taskController.create);
router.put("/", taskController.update);
router.delete("/:id", taskController.delete);
router.get("/:id", taskController.find);

export default router;
