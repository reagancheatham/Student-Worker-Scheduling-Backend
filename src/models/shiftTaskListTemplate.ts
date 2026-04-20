import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";

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
            allowNull: false,
            references: {
                model: ScheduleShiftTemplate,
                key: "id",
            },
            onDelete: "CASCADE",
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
