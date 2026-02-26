import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class ScheduleShiftTemplate extends Model<
    InferAttributes<ScheduleShiftTemplate>,
    InferCreationAttributes<ScheduleShiftTemplate>
> {
    declare scheduleTemplateID: number;
    declare id: CreationOptional<number>;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
}

ScheduleShiftTemplate.init(
    {
        scheduleTemplateID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ScheduleTemplate,
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
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["scheduleTemplateID", "name"],
            },
        ],
        validate: {
            endAfterStart(this: ScheduleShiftTemplate) {
                if (this.endTime <= this.startTime) {
                    throw new Error("End time must be after start time");
                }
            },
        },
    },
);

class ScheduleShiftTemplateRouter extends ModelRouter {
    public path(): string {
        return "/scheduleShiftTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(ScheduleShiftTemplate, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
                "id",
            ),
        );
        router.delete("/:scheduleTemplateID/:id", (req, res) =>
            ScheduleDatabase.delete(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
                "id",
            ),
        );
        router.get("/:scheduleTemplateID/:id", (req, res) =>
            ScheduleDatabase.get(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
                "id",
            ),
        );
        router.get("/:scheduleTemplateID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                ScheduleShiftTemplate,
                req,
                res,
                "scheduleTemplateID",
            ),
        );
    }
}

export const scheduleShiftTemplateRouter = new ScheduleShiftTemplateRouter();