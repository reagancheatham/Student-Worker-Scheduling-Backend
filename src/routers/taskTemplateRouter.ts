import { Request, Router } from "express";
import {
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { TaskListTemplate } from "../models/taskListTemplate.ts";
import { TaskTemplate } from "../models/taskTemplate.ts";

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const taskTemplate = await TaskTemplate.findOne({
        where: { id },
        include: TaskListTemplate,
    });

    return (taskTemplate as any)?.TaskListTemplate?.businessID;
};

const taskListIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.taskListID;

    if (!id) id = req.body?.taskListID;
    if (!id) return undefined;

    const taskList = await TaskListTemplate.findOne({ where: { id } });

    return taskList?.businessID;
};

class TaskTemplateRouter extends ModelRouter {
    public path(): string {
        return "/taskTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(taskListIDResolver), (req, res) =>
            ScheduleDatabase.create(TaskTemplate, req, res),
        );
        router.put("/", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.update(TaskTemplate, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(TaskTemplate, req, res, "id"),
        );
        router.get("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(TaskTemplate, req, res, "id"),
        );
        router.get(
            "/taskList/:taskListID",
            managerAuth(taskListIDResolver),
            (req, res) => {
                const taskListID = req.params?.taskListID;

                if (!taskListID) {
                    Logger.error(`Error finding ${TaskListTemplate.name} id!`);
                    return;
                }

                ScheduleDatabase.getAllWhere(TaskTemplate, req, res, {
                    include: {
                        model: TaskListTemplate,
                        where: { id: taskListID },
                    },
                });
            },
        );
    }
}

export const taskTemplateRouter = new TaskTemplateRouter();
