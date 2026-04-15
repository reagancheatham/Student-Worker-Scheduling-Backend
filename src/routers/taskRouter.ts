import { Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Task } from "../models/task.ts";
import { TaskCheckOff } from "../models/taskCheckOff.ts";
import { adminAuth } from "../authentication.ts";
import { Logger } from "../classes/util/logger.ts";
import { businessAuth } from "../authorization/businessAuthorization.ts";

// i've discovered that we need to move routers out of model files for certain things to work...
class TaskRouter extends ModelRouter {
    public path(): string {
        return "/tasks";
    }

    protected buildRouter(router: Router): void {
        router.post("/", adminAuth, (req, res) => ScheduleDatabase.create(Task, req, res));
        router.put("/", adminAuth, (req, res) =>
            ScheduleDatabase.update(Task, req, res, "id"),
        );
        router.delete("/:id", adminAuth, (req, res) =>
            ScheduleDatabase.delete(Task, req, res, "id"),
        );
        router.get("/:id", adminAuth, (req, res) =>
            ScheduleDatabase.getWhere(
                Task,
                req,
                res,
                { include: TaskCheckOff },
                "id",
            ),
        );
        router.get("/taskList/:taskListID", businessAuth(), (req, res) =>
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
        let id = task.id;
        task.listOrder = listOrder;
        let taskPromises: Promise<any>[] = [];

        Logger.log("creating task: " + JSON.stringify(task));
        if (task.id > 0)
            taskPromises.push(Task.update(task, { where: { id } }));
        else {
            let taskInstance = await Task.create(task);
            id = taskInstance.id;
        } 
        
        Logger.log("task created");

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
