import { Router } from "express";
import { adminAuth } from "../authentication.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { PermissionRole } from "../models/permissionRole.ts";

class PermissionRoleRouter extends ModelRouter {
    public path(): string {
        return "/permissionRoles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(PermissionRole, req, res),
        );
        router.put("/", adminAuth(), (req, res) =>
            ScheduleDatabase.update(PermissionRole, req, res, "id"),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(PermissionRole, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(PermissionRole, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(PermissionRole, req, res),
        );
    }
}

export const permissionRoleRouter = new PermissionRoleRouter();