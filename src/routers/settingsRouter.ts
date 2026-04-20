import { Router } from "express";
import { managerAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Settings } from "../models/settings.ts";

class SettingsRouter extends ModelRouter {
    public path(): string {
        return "/settings";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(), (req, res) =>
            ScheduleDatabase.create(Settings, req, res),
        );
        router.put("/", managerAuth(), (req, res) =>
            ScheduleDatabase.update(Settings, req, res, "businessID"),
        );
        router.delete("/:businessID", managerAuth(), (req, res) =>
            ScheduleDatabase.delete(Settings, req, res, "businessID"),
        );
        router.get("/:businessID", managerAuth(), (req, res) =>
            ScheduleDatabase.get(Settings, req, res, "businessID"),
        );
    }
}

export const settingsRouter = new SettingsRouter();