import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { User } from "./user.model.ts";
import { Business } from "./business.model.ts";

export class Manager extends Model<
    InferAttributes<Manager>,
    InferCreationAttributes<Manager>
> {
    declare userID: number;
    declare businessID: number;
}

Manager.init(
    {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: "id",
            },
        },
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);
