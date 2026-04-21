import { Request, Response, Router } from "express";
import {
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { TaskListTemplate } from "../models/taskListTemplate.ts";
import { TaskTemplate } from "../models/taskTemplate.ts";
import { Logger } from "../classes/util/logger.ts";
import { taskTemplateRouter } from "./taskTemplateRouter.ts";

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
        router.post("/", managerAuth(), TaskListTemplateRouter.createTaskList);
        router.put("/", managerAuth(), TaskListTemplateRouter.updateTaskList);
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(TaskListTemplate, req, res, "id"),
        );
        router.get("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.getWhere(
                TaskListTemplate,
                req,
                res,
                { include: TaskTemplate },
                "id",
            ),
        );
        router.get("/business/:businessID", managerAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskListTemplate,
                req,
                res,
                {
                    include: TaskTemplate,
                },
                "businessID",
            ),
        );
    }

    private static async createTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(
                `Error updating ${TaskListTemplate.name}: info is null`,
            );
            return Promise.resolve();
        }

        Logger.log(
            `Creating ${TaskListTemplate.name} with info ${JSON.stringify(info)}`,
        );

        try {
            const list = await TaskListTemplate.create(info);
            let tasks = info.tasks as TaskTemplate[];

            tasks.forEach((task) => {
                task.taskListTemplateID = list.id;
            });

            const taskUpdateResult =
                await TaskListTemplateRouter.updateTaskListTasks(tasks);

            const updatedTasks: TaskTemplate[] = [];

            taskUpdateResult.forEach((tr) => {
                if (!Array.isArray(tr)) updatedTasks.push(tr);
                else if (tr[0] !== 0 && tr[0] !== undefined)
                    updatedTasks.push(...tr[1]);
            });

            tasks = updatedTasks;

            (list as any).TaskTemplates = tasks;
            res.status(200).send(list);
        } catch (error: any) {
            Logger.error(`Error creating ${TaskListTemplate.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async updateTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(
                `Error updating ${TaskListTemplate.name}: info is null`,
            );
            return Promise.resolve();
        }

        Logger.log(
            `Updating ${TaskListTemplate.name} with info: ${JSON.stringify(info)}`,
        );

        const id = info.id;
        let tasks = info.tasks as TaskTemplate[];

        try {
            const result = await TaskListTemplate.update(info, {
                where: { id },
                returning: true,
            });

            let updatedBody = info;

            if (result[0] === 0 || result[0] === undefined)
                Logger.log(
                    `Could not find a ${TaskListTemplate.name} to update`,
                );
            else {
                Logger.log(`Updated ${result[0]} ${TaskListTemplate.name}s`);
                updatedBody = result[1][0];
            }

            const taskUpdateResult =
                await TaskListTemplateRouter.updateTaskListTasks(tasks);

            if (taskUpdateResult) {
                const updatedTasks: TaskTemplate[] = [];

                taskUpdateResult.forEach((tr) => {
                    if (!Array.isArray(tr)) updatedTasks.push(tr);
                    else if (tr[0] !== 0 && tr[0] !== undefined)
                        updatedTasks.push(...tr[1]);
                });

                tasks = updatedTasks;
            }

            (updatedBody as any).TaskTemplates = tasks;
            res.status(200).send(updatedBody);
        } catch (error: any) {
            Logger.error(`Error updating ${TaskListTemplate.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async updateTaskListTasks(tasks: TaskTemplate[]) {
        if (!tasks || tasks.length === 0) return Promise.resolve([]);

        Logger.log(`Updating ${TaskListTemplate.name} tasks: ${tasks.length}`);

        const promises = tasks.map(async (task) => {
            if (task.id === 0) return await TaskTemplate.create(task);
            else
                return await TaskTemplate.update(task, {
                    where: { id: task.id },
                    returning: true,
                });
        });

        return await Promise.all(promises);
    }
}

export const taskListTemplateRouter = new TaskListTemplateRouter();
