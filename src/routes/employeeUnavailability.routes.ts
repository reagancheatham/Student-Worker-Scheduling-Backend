import { Router } from "express";
import {EmployeeUnavailabilityController} from "../controllers/employeeUnavailability.controller.ts";

const EmployeeUnavailabilityRouter = Router();

EmployeeUnavailabilityRouter.post("/", EmployeeUnavailabilityController.create);
EmployeeUnavailabilityRouter.put("/", EmployeeUnavailabilityController.update);
EmployeeUnavailabilityRouter.delete(
    "/:id",
    EmployeeUnavailabilityController.delete,
);
EmployeeUnavailabilityRouter.get("/:id", EmployeeUnavailabilityController.get);

export { EmployeeUnavailabilityRouter };
