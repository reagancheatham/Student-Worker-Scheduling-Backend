import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";

class PermissionRole extends Model<
    InferAttributes<PermissionRole>,
    InferCreationAttributes<PermissionRole>
> {
    declare id: CreationOptional<number>;
    declare role: string;
}

PermissionRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "permissionRole",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "role",
                ],
            },
        ],
    },
);

export default PermissionRole;
