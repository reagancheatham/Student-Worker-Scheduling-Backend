import { Router } from "express";
import taskListController from "../controllers/taskList.controller.ts"

const router = Router();

router.post("/", taskListController.create);
router.put("/", taskListController.update);
router.delete("/:id", taskListController.delete);
router.get("/:id", taskListController.get);
router.get("/", taskListController.getAll);

export default router;
