import { Router } from "express";
import { adminAuth } from "../authentication.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { BusinessPermissionRole } from "../models/businessPermissionRole.ts";

class BusinessPermissionRoleRouter extends ModelRouter {
    public path(): string {
        return "/businessPermissionRoles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(BusinessPermissionRole, req, res),
        );
        router.put("/", adminAuth(), (req, res) =>
            ScheduleDatabase.update(BusinessPermissionRole, req, res, "id"),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(BusinessPermissionRole, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(BusinessPermissionRole, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(BusinessPermissionRole, req, res),
        );
    }
}

export const businessPermissionRoleRouter = new BusinessPermissionRoleRouter();