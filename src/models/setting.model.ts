import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import {Business} from "./business.model.ts";

class Setting extends Model<InferAttributes<Setting>, InferCreationAttributes<Setting>> {
    declare businessID: number;
}

Setting.init(
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
        tableName: "setting",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID"],
            },
        ],
    },
);

export default Setting;
