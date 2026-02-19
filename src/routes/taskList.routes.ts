import { Router } from "express";
import { TaskListController } from "../controllers/taskList.controller.ts"

const router = Router();

router.post("/", TaskListController.create);
router.put("/", TaskListController.update);
router.delete("/:id", TaskListController.delete);
router.get("/:id", TaskListController.get);
router.get("/", TaskListController.getAll);
router.get("/business/:businessID/", TaskListController.getAllForBusiness);

export default router;
