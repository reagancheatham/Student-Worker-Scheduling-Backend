import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller.ts";

const EmployeeRouter = Router();

EmployeeRouter.post("/", EmployeeController.create);
EmployeeRouter.put("/", EmployeeController.update);
EmployeeRouter.delete("/:id", EmployeeController.delete);
EmployeeRouter.get("/:id", EmployeeController.get);

export { EmployeeRouter };
