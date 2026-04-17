import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleTemplate } from "./scheduleTemplate.ts";
import { EventColor } from "../classes/eventColor.ts";
import { WeekDay } from "../classes/weekDay.ts";

export class ScheduleShiftTemplate extends Model<
    InferAttributes<ScheduleShiftTemplate>,
    InferCreationAttributes<ScheduleShiftTemplate>
> {
    declare id: CreationOptional<number>;
    declare scheduleTemplateID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare color: EventColor;
    declare weekDay: WeekDay;
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
            allowNull: false,
            references: {
                model: ScheduleTemplate,
                key: "id",
            },
            onDelete: "CASCADE",
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
        color: {
            type: DataTypes.ENUM(...Object.values(EventColor)),
            allowNull: false,
        },
        weekDay: {
            type: DataTypes.ENUM(...Object.values(WeekDay)),
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["scheduleTemplateID", "name", "color"],
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