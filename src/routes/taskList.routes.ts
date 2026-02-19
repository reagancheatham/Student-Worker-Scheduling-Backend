import { Router } from "express";
import { TaskListController } from "../controllers/taskList.controller.ts";

const TaskListRouter = Router();

TaskListRouter.post("/", TaskListController.create);
TaskListRouter.put("/", TaskListController.update);
TaskListRouter.delete("/:id", TaskListController.delete);
TaskListRouter.get("/:id", TaskListController.get);
TaskListRouter.get("/", TaskListController.getAll);
TaskListRouter.get(
    "/business/:businessID/",
    TaskListController.getAllForBusiness,
);

export { TaskListRouter };
