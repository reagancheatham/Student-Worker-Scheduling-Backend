import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";

export class BusinessPermissionRole extends Model<
    InferAttributes<BusinessPermissionRole>,
    InferCreationAttributes<BusinessPermissionRole>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

BusinessPermissionRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);
