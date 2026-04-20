import { Request, Router } from "express";
import { adminAuth } from "../authentication.ts";
import {
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Invite } from "../models/invite.ts";
import { BusinessPermissionRole } from "../models/businessPermissionRole.ts";
import { Business } from "../models/business.ts";

const resolver: IDResolver = async (req: Request) => {
    let code = req.params?.code;

    if (!code) return undefined;

    const invite = await Invite.findOne({
        where: { code },
    });

    return invite?.businessID;
};

class InviteRouter extends ModelRouter {
    public path(): string {
        return "/invites";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(), (req, res) =>
            ScheduleDatabase.create(Invite, req, res),
        );
        router.put("/", managerAuth(), (req, res) =>
            ScheduleDatabase.update(Invite, req, res, "code"),
        );
        router.delete("/:code", managerAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(Invite, req, res, "code"),
        );
        router.get("/:code", managerAuth(resolver), (req, res) =>
            ScheduleDatabase.get(Invite, req, res, "code"),
        );
        router.get("/", adminAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(Invite, req, res, {
                include: [
                    Business,
                    BusinessPermissionRole,
                ],
            }),
        );
    }
}

export const inviteRouter = new InviteRouter();
