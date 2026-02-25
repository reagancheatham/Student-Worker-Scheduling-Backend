import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.model.ts";

export class ShiftTaskTemplate extends Model<
    InferAttributes<ShiftTaskTemplate>,
    InferCreationAttributes<ShiftTaskTemplate>
> {
    declare id: CreationOptional<number>;
    declare shiftTaskListID: number;
    declare name: string;
    declare description: string;
}

ShiftTaskTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftTaskListID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: ShiftTaskListTemplate,
                key: "id",
            },
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
