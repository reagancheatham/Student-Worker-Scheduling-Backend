import { Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Timesheet } from "../models/timesheet.ts";

class TimesheetRouter extends ModelRouter {
    public path(): string {
        return "/timesheets";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Timesheet, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Timesheet, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Timesheet, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Timesheet, req, res, "id"),
        );
    }
}

export const timesheetRouter = new TimesheetRouter();
