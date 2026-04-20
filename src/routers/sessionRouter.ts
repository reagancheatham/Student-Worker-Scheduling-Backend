import { Router } from "express";
import { Session } from "../models/session.ts";
import { adminAuth, userAuth } from "../authentication.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

class SessionRouter extends ModelRouter {
    public path(): string {
        return "/sessions";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(Session, req, res),
        );
        router.put("/", adminAuth(), (req, res) =>
            ScheduleDatabase.update(Session, req, res, "id"),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(Session, req, res, "id"),
        );
        router.get("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.get(Session, req, res, "id"),
        );
        router.get("/user/:userID", userAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(Session, req, res, {}, "userID"),
        );
    }
}

export const sessionRouter = new SessionRouter();
