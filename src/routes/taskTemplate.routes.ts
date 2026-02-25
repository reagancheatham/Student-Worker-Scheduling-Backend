import { Router } from "express";
import { TaskListController } from "../controllers/taskList.controller.ts";

const TaskTemplateRouter = Router();

TaskTemplateRouter.post("/", TaskListController.create);
TaskTemplateRouter.put("/", TaskListController.update);
TaskTemplateRouter.delete("/:id", TaskListController.delete);
TaskTemplateRouter.get("/:id", TaskListController.get);
TaskTemplateRouter.get("/", TaskListController.getAll);

export { TaskTemplateRouter };
