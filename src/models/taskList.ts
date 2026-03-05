import { Model, DataTypes } from "sequelize";
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
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TaskList, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(TaskList, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(TaskList, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(TaskList, req, res, "id"),
        );
        router.get("/shift/:shiftID", (req, res) =>
            ScheduleDatabase.getAllWhere(TaskList, req, res, "shiftID"),
        );
    }
}

export const taskListRouter = new TaskListRouter();