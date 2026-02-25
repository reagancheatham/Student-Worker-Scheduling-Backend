import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { User } from "./user.model.ts";

export class Session extends Model<
    InferAttributes<Session>,
    InferCreationAttributes<Session>
> {
    declare id: CreationOptional<number>;
    declare userID: number;
    declare expirationTime: Date;
    declare token: string;
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        expirationTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);
