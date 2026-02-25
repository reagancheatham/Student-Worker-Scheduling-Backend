import { Router } from "express";
import { TaskListController } from "../controllers/taskList.controller.ts";

const TaskListTemplateRouter = Router();

TaskListTemplateRouter.post("/", TaskListController.create);
TaskListTemplateRouter.put("/", TaskListController.update);
TaskListTemplateRouter.delete("/:id", TaskListController.delete);
TaskListTemplateRouter.get("/:id", TaskListController.get);
TaskListTemplateRouter.get("/", TaskListController.getAll);

export { TaskListTemplateRouter };
