import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.ts";
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
