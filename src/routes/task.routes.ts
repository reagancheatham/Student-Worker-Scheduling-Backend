import { Router } from "express";
import { TaskController } from "../controllers/task.controller.ts";

const TaskRouter = Router();

TaskRouter.post("/", TaskController.create);
TaskRouter.put("/", TaskController.update);
TaskRouter.delete("/:id", TaskController.delete);
TaskRouter.get("/:id", TaskController.get);

export { TaskRouter };
