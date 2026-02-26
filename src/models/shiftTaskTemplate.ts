import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class ShiftTaskTemplate extends Model<
    InferAttributes<ShiftTaskTemplate>,
    InferCreationAttributes<ShiftTaskTemplate>
> {
    declare shiftTaskListID: number;
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
}

ShiftTaskTemplate.init(
    {
        shiftTaskListID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ShiftTaskListTemplate,
                key: "id",
            },
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["shiftTaskListID", "name"],
            },
        ],
    },
);

class ShiftTaskTemplateRouter extends ModelRouter {
    public path(): string {
        return "/shiftTaskTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(ShiftTaskTemplate, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                ShiftTaskTemplate,
                req,
                res,
                "shiftTaskListID",
                "id",
            ),
        );
        router.delete("/:shiftTaskListID/:id", (req, res) =>
            ScheduleDatabase.delete(
                ShiftTaskTemplate,
                req,
                res,
                "shiftTaskListID",
                "id",
            ),
        );
        router.get("/:shiftTaskListID/:id", (req, res) =>
            ScheduleDatabase.get(
                ShiftTaskTemplate,
                req,
                res,
                "shiftTaskListID",
                "id",
            ),
        );
        router.get("/:shiftTaskListID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftTaskTemplate,
                req,
                res,
                "shiftTaskListID",
            ),
        );
    }
}

export const shiftTaskTemplateRouter = new ShiftTaskTemplateRouter();
