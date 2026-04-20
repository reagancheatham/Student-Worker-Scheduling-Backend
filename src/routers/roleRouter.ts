import { Request, Router } from "express";
import { IDResolver, managerAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Role } from "../models/role.ts";

const resolver: IDResolver = async (req: Request) => {
    const id = req.params.id;

    if (!id) return undefined;

    const role = await Role.findOne({ where: { id } });

    return role?.businessID;
};

class RoleRouter extends ModelRouter {
    public path(): string {
        return "/roles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(), (req, res) =>
            ScheduleDatabase.create(Role, req, res),
        );
        router.put("/", managerAuth(), (req, res) =>
            ScheduleDatabase.update(Role, req, res, "id"),
        );
        router.delete("/:id", managerAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(Role, req, res, "id"),
        );
        router.get("/:id", managerAuth(resolver), (req, res) =>
            ScheduleDatabase.get(Role, req, res, "id"),
        );
        router.get("/business/:businessID", managerAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(Role, req, res, {}, "businessID"),
        );
    }
}

export const roleRouter = new RoleRouter();