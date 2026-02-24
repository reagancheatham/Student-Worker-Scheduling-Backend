import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { Business } from "./business.model.ts";

export class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role>
> {
    declare id: CreationOptional<number>;
    declare role: string;
    declare businessID: number;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
            primaryKey: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "role",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["role", "businessID"],
            },
        ],
    },
);
