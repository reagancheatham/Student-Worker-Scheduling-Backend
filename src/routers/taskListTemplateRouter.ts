import { Request, Router } from "express";
import { IDResolver, managerAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { TaskListTemplate } from "../models/taskListTemplate.ts";

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const taskListTemplate = await TaskListTemplate.findOne({ where: { id } });

    return taskListTemplate?.businessID;
};

class TaskListTemplateRouter extends ModelRouter {
    public path(): string {
        return "/taskListTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(), (req, res) =>
            ScheduleDatabase.create(TaskListTemplate, req, res),
        );
        router.put("/", managerAuth(), (req, res) =>
            ScheduleDatabase.update(TaskListTemplate, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(TaskListTemplate, req, res, "id"),
        );
        router.get("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(TaskListTemplate, req, res, "id"),
        );
        router.get("/business/:businessID", managerAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskListTemplate,
                req,
                res,
                {},
                "businessID",
            ),
        );
    }
}

export const taskListTemplateRouter = new TaskListTemplateRouter();
