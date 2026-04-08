import { Model, DataTypes } from "sequelize";
import { Request, Response } from "express";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Task } from "./task.ts";
import { TaskStatus } from "../classes/taskStatus.ts";

export class TaskList extends Model<
    InferAttributes<TaskList>,
    InferCreationAttributes<TaskList>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare name: string;
}

TaskList.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shift,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Task List",
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["shiftID", "name"],
            },
        ],
    },
);

class TaskListRouter extends ModelRouter {
    public path(): string {
        return "/taskLists";
    }

    protected buildRouter(router: Router): void {
        router.post("/", TaskListRouter.createTaskList);
        router.put("/", TaskListRouter.updateTaskList);
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(TaskList, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(TaskList, req, res, "id"),
        );
        router.get("/shift/:shiftID", TaskListRouter.getOrCreateForShift);
    }

    private static async createTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            console.error(`Error updating ${TaskList.name}: info is null`);
            return Promise.resolve();
        }

        console.log(
            `Creating ${TaskList.name} with info: ${JSON.stringify(info)}`,
        );

        try {
            const result = await TaskList.create(info);
            const tasks = info.tasks as Task[];

            tasks.forEach((task) => {
                task.taskListID = result.id;
            });

            await TaskListRouter.updateTaskListTasks(tasks);
        } catch (error) {
            console.error(`Error creating ${TaskList.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async updateTaskList(req: Request, res: Response) {
        const info = req.body;

        if (!info) {
            console.error(`Error updating ${TaskList.name}: info is null`);
            return Promise.resolve();
        }

        console.log(
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
                console.log(`Could not find a ${TaskList.name} to update`);
            else console.log(`Updated ${result[0]} ${TaskList.name}s`);

            await TaskListRouter.updateTaskListTasks(tasks);

            res.status(200).send({ affectedCount: result[0] });
        } catch (error) {
            console.error(`Error updating ${TaskList.name}: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async updateTaskListTasks(tasks: Task[]) {
        // No tasks to update, just leave
        if (!tasks) return Promise.resolve();

        console.log(`Updating ${TaskList.name} tasks`);

        const promises = tasks.map(async (task, index) => {
            const id = task.id;
            task.listOrder = index;

            if (task.id > 0) await Task.update(task, { where: { id } });
            else await Task.create(task);
        });

        await Promise.all(promises);
    }

    private static async getOrCreateForShift(req: Request, res: Response) {
        try {
            const response = await TaskList.findOrCreate({
                where: req.params,
                defaults: {
                    shiftID: Number(req.params.shiftID),
                },
                include: {
                    model: Task,
                },
            });

            const taskList = response[0];
            console.log(`Successfully found/created ${TaskList.name}`);

            res.status(200).send(taskList);
        } catch (error) {
            console.error(`Error creating ${TaskList.name}: ${error}`);
            res.status(500).send({ error });
        }
    }
}

export const taskListRouter = new TaskListRouter();
