import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { TaskList } from "../models/taskList.ts";
import { Task } from "../models/task.ts";
import { TaskCheckOff } from "../models/taskCheckOff.ts";
import { taskRouter } from "./taskRouter.ts";
import { Employee } from "../models/employee.ts";
import { User } from "../models/user.ts";
import { Logger } from "../classes/util/logger.ts";
import { businessAuth, BusinessResolver } from "../authorization/businessAuthorization.ts";
import { Shift } from "../models/shift.ts";

const resolver: BusinessResolver = async (req: Request) => {
    let shiftID = req.params?.shiftID;

    if (!shiftID) shiftID = req.body?.shiftID;

    if (!shiftID) return undefined;

    try {
        const shift = await Shift.findOne({ where: { id: shiftID } });

        if (!shift) return undefined;

        return shift.businessID;
    } catch (error) {
        Logger.error(`Error fetching ${Shift.name}.`);
        return undefined;
    }
};

class TaskListRouter extends ModelRouter {
    public path(): string {
        return "/taskLists";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(resolver), TaskListRouter.createTaskList);
        router.put("/", businessAuth(resolver), TaskListRouter.updateTaskList);
        router.delete("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.delete(TaskList, req, res, "id"),
        );
        router.get("/:id", businessAuth(resolver), (req, res) =>
            ScheduleDatabase.get(TaskList, req, res, "id"),
        );
        router.get("/shift/:shiftID", businessAuth(resolver), TaskListRouter.getOrCreateForShift);
    }

    private static async createTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(`Error updating ${TaskList.name}: info is null`);
            return Promise.resolve();
        }

        Logger.log(
            `Creating ${TaskList.name} with info: ${JSON.stringify(info)}`,
        );

        try {
            const list = await TaskList.create(info);
            const tasks = info.tasks as Task[];

            tasks.forEach((task) => {
                task.taskListID = list.id;
            });

            await TaskListRouter.updateTaskListTasks(tasks);
            res.status(200).send(list);
        } catch (error) {
            Logger.error(`Error creating ${TaskList.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async updateTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            Logger.error(`Error updating ${TaskList.name}: info is null`);
            return Promise.resolve();
        }

        Logger.log(
            `Updating ${TaskList.name} with info: ${JSON.stringify(info)}`,
        );

        const id = info.id;
        const tasks = info.tasks as Task[];

        try {
            const result = await TaskList.update(info, {
                where: {
                    id,
                },
            });

            if (result[0] === 0)
                Logger.log(`Could not find a ${TaskList.name} to update`);
            else Logger.log(`Updated ${result[0]} ${TaskList.name}s`);

            await TaskListRouter.updateTaskListTasks(tasks);

            res.status(200).send({ affectedCount: result[0] });
        } catch (error) {
            Logger.error(`Error updating ${TaskList.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async updateTaskListTasks(tasks: Task[]) {
        // No tasks to update, just leave
        if (!tasks || tasks.length === 0) return Promise.resolve();

        Logger.log(`Updating ${TaskList.name} tasks`);

        const promises = tasks.map(async (task, index) => {
            await taskRouter.createOrUpdateTask(task, index);
        });

        await Promise.all(promises);
    }

    private static async getOrCreateForShift(req: Request, res: Response) {
        try {
            const response = await TaskList.findOrCreate({
                where: req.params,
                defaults: {
                    shiftID: Number(req.params.shiftID),
                    name: "Task List",
                },
                include: [
                    {
                        model: Task,
                        include: [
                            {
                                model: TaskCheckOff,
                                include: [
                                    {
                                        model: Employee,
                                        include: [User],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            const taskList = response[0];
            Logger.log(`Successfully found/created ${TaskList.name}`);

            res.status(200).send(taskList);
        } catch (error) {
            Logger.error(`Error creating ${TaskList.name}: ${error}`);
            res.status(500).send({ error });
        }
    }
}

export const taskListRouter = new TaskListRouter();
