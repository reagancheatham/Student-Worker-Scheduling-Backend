import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class ShiftTaskListTemplate extends Model<
    InferAttributes<ShiftTaskListTemplate>,
    InferCreationAttributes<ShiftTaskListTemplate>
> {
    declare scheduleShiftID: number;
    declare id: CreationOptional<number>;
    declare name: string;
}

ShiftTaskListTemplate.init(
    {
        scheduleShiftID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ScheduleShiftTemplate,
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
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["scheduleShiftID", "name"],
            },
        ],
    },
);

class ShiftTaskListTemplateRouter extends ModelRouter {
    public path(): string {
        return "/shiftTaskListTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(ShiftTaskListTemplate, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                ShiftTaskListTemplate,
                req,
                res,
                "scheduleShiftID",
                "id",
            ),
        );
        router.delete("/:scheduleShiftID/:id", (req, res) =>
            ScheduleDatabase.delete(
                ShiftTaskListTemplate,
                req,
                res,
                "scheduleShiftID",
                "id",
            ),
        );
        router.get("/:scheduleShiftID/:id", (req, res) =>
            ScheduleDatabase.get(
                ShiftTaskListTemplate,
                req,
                res,
                "scheduleShiftID",
                "id",
            ),
        );
        router.get("/:scheduleShiftID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftTaskListTemplate,
                req,
                res,
                "scheduleShiftID",
            ),
        );
    }
}

export const shiftTaskListTemplateRouter = new ShiftTaskListTemplateRouter();