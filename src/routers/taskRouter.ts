import { Request, Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Task } from "../models/task.ts";
import { TaskCheckOff } from "../models/taskCheckOff.ts";
import {
    businessAuth,
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { Logger } from "../classes/util/logger.ts";
import { TaskList } from "../models/taskList.ts";
import { Shift } from "../models/shift.ts";

const idResolver: IDResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) id = req.body?.id;
    if (!id) return undefined;

    try {
        const task = await Task.findOne({
            where: { id },
            include: [
                {
                    model: TaskList,
                    include: [
                        {
                            model: Shift,
                            attributes: ["businessID"],
                        },
                    ],
                },
            ],
        });

        return (task as any)?.TaskList?.Shift?.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${Task.name}: ${error}`);
    }
};

const taskListIDResolver: IDResolver = async (req: Request) => {
    let taskListID = req.params?.id;

    if (!taskListID) taskListID = req.body?.id;
    if (!taskListID) return undefined;

    try {
        const taskList = await TaskList.findOne({
            where: { id: taskListID },
            include: Shift,
        });

        return (taskList as any)?.Shift?.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${Task.name}: ${error}`);
    }
};

// i've discovered that we need to move routers out of model files for certain things to work...
class TaskRouter extends ModelRouter {
    public path(): string {
        return "/tasks";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(taskListIDResolver), (req, res) =>
            ScheduleDatabase.create(Task, req, res),
        );
        router.put("/", managerAuth(taskListIDResolver), (req, res) =>
            ScheduleDatabase.update(Task, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(Task, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.getWhere(
                Task,
                req,
                res,
                { include: TaskCheckOff },
                "id",
            ),
        );
        router.get(
            "/taskList/:taskListID",
            businessAuth(taskListIDResolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    Task,
                    req,
                    res,
                    { include: TaskCheckOff },
                    "taskListID",
                ),
        );
    }

    public async createOrUpdateTask(
        task: Task,
        listOrder: number,
    ): Promise<void> {
        console.log(`Task: ${JSON.stringify(task)}`);

        let id = task.id;
        let taskPromises: Promise<any>[] = [];
        task.listOrder = listOrder;

        if (task.id > 0)
            taskPromises.push(Task.update(task, { where: { id } }));
        else {
            let taskInstance = await Task.create(task);
            id = taskInstance.id;
        }

        const checkOffs: TaskCheckOff[] = (task as any)["checkOffs"];

        if (checkOffs) {
            checkOffs.forEach((check) => {
                check.taskID = id;

                if (check.id > 0)
                    taskPromises.push(
                        TaskCheckOff.update(check, {
                            where: { id: check.id },
                        }),
                    );
                else taskPromises.push(TaskCheckOff.create(check));
            });
        }

        await Promise.all(taskPromises);
    }
}

export const taskRouter = new TaskRouter();
