import { Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { EmployeeUnavailability } from "../models/employeeUnavailability.ts";

class EmployeeUnavailabilityRouter extends ModelRouter {
    public path(): string {
        return "/employeeUnavailabilities";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) => ScheduleDatabase.create(EmployeeUnavailability, req, res));
        router.put("/", (req, res) => ScheduleDatabase.update(EmployeeUnavailability, req, res, "id"));
        router.delete("/:id", (req, res) => ScheduleDatabase.delete(EmployeeUnavailability, req, res, "id"));
        router.get("/:id", (req, res) => ScheduleDatabase.get(EmployeeUnavailability, req, res, "id"));
        router.get("/:employeeID", (req, res) => ScheduleDatabase.getAllWhere(EmployeeUnavailability, req, res, {}, "employeeID"));
    }
}

export const employeeUnavailabilityRouter = new EmployeeUnavailabilityRouter();