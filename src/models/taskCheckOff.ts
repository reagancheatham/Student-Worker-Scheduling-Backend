import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Task } from "./task.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";
import { Logger } from "../classes/util/logger.ts";
import { TaskList } from "./taskList.ts";
import { Shift } from "./shift.ts";

export class TaskCheckOff extends Model<
    InferAttributes<TaskCheckOff>,
    InferCreationAttributes<TaskCheckOff>
> {
    declare id: CreationOptional<number>;
    declare taskID: number;
    declare sourceEmployeeID: number;
}

TaskCheckOff.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taskID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Task,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        sourceEmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "SET NULL",
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

const idResolver: BusinessResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) id = req.body?.id;
    if (!id) return undefined;

    try {
        const checkOff = TaskCheckOff.findOne({
            where: { id },
            include: [
                {
                    model: Task,
                    include: [
                        {
                            model: TaskList,
                            include: [
                                {
                                    model: Shift,
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        return (checkOff as any)?.Task?.TaskList?.Shift?.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${TaskCheckOff.name}: ${error}`);
        return undefined;
    }
};

const taskIDResolver: BusinessResolver = async (req: Request) => {
    const id = req.params?.taskID;

    if (!id) return undefined;

    const task = Task.findOne({
        where: { id },
        include: [
            {
                model: TaskList,
                include: [
                    {
                        model: Shift,
                    },
                ],
            },
        ],
    });

    return (task as any)?.TaskList.Shift?.businessID;
};

class TaskCheckOffRouter extends ModelRouter {
    public path(): string {
        return "/taskCheckOffs";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(taskIDResolver), (req, res) =>
            ScheduleDatabase.create(TaskCheckOff, req, res),
        );
        router.put("/", businessAuth(taskIDResolver), (req, res) =>
            ScheduleDatabase.update(TaskCheckOff, req, res, "id"),
        );
        router.delete("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(TaskCheckOff, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.getWhere(
                TaskCheckOff,
                req,
                res,
                {
                    include: {
                        model: Employee,
                        include: [User],
                    },
                },
                "id",
            ),
        );
        router.get("/task/:taskID", businessAuth(taskIDResolver), (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskCheckOff,
                req,
                res,
                {
                    include: [
                        {
                            model: Employee,
                            include: [User],
                        },
                    ],
                },
                "taskID",
            ),
        );
    }
}

export const taskCheckOffRouter = new TaskCheckOffRouter();
