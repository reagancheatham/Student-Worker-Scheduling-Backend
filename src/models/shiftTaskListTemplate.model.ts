import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.model.ts";

export class ShiftTaskListTemplate extends Model<
    InferAttributes<ShiftTaskListTemplate>,
    InferCreationAttributes<ShiftTaskListTemplate>
> {
    declare id: CreationOptional<number>;
    declare scheduleShiftID: number;
    declare name: string;
}

ShiftTaskListTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        scheduleShiftID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ScheduleShiftTemplate,
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
                fields: ["scheduleShiftID", "name"],
            },
        ],
    },
);
