import { Router } from "express";
import { adminAuth, userAuth } from "../authentication.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { User } from "../models/user.ts";

class UserRouter extends ModelRouter {
    public path(): string {
        return "/users";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(User, req, res),
        );
        router.put("/", userAuth(), (req, res) =>
            ScheduleDatabase.update(User, req, res, "id"),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(User, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(User, req, res, "id"),
        );
        router.get("/", (req, res) => ScheduleDatabase.getAll(User, req, res));
    }
}

export const userRouter = new UserRouter();
