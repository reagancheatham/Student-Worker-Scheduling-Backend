import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.model.ts";

export class Settings extends Model<
    InferAttributes<Settings>,
    InferCreationAttributes<Settings>
> {
    declare businessID: number;
}

Settings.init(
    {
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "settings",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID"],
            },
        ],
    },
);
