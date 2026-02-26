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
