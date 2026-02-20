import { Router } from "express";
import employeeUnavailabilityController from "../controllers/employeeUnavailability.controller.ts";

const EmployeeUnavailabilityRouter = Router();

EmployeeUnavailabilityRouter.post("/", employeeUnavailabilityController.create);
EmployeeUnavailabilityRouter.put("/", employeeUnavailabilityController.update);
EmployeeUnavailabilityRouter.delete(
    "/:id",
    employeeUnavailabilityController.delete,
);
EmployeeUnavailabilityRouter.get("/:id", employeeUnavailabilityController.find);

export { EmployeeUnavailabilityRouter };
