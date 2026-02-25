import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.model.ts";

export class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare name: string;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
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
                fields: ["id, businessID, name"],
            },
        ],
    },
);
