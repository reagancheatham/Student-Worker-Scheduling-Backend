import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleTemplate } from "./scheduleTemplate.model.ts";

export class ScheduleShiftTemplate extends Model<
    InferAttributes<ScheduleShiftTemplate>,
    InferCreationAttributes<ScheduleShiftTemplate>
> {
    declare id: CreationOptional<number>;
    declare scheduleTemplateID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
}

ScheduleShiftTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        scheduleTemplateID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ScheduleTemplate,
                key: "id",
            },
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
                fields: ["id", "scheduleTemplateID", "name"],
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
