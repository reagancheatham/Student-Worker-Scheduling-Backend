import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { User } from "./user.ts";
import { WeekDay } from "../classes/weekDay.ts";

export class UserClass extends Model<
    InferAttributes<UserClass>,
    InferCreationAttributes<UserClass>
> {
    declare id: CreationOptional<number>;
    declare userID: number;
    declare courseID: string;
    declare name: string;
    declare startDate: Date;
    declare endDate: Date;
    declare startTime: string;
    declare endTime: string;
    declare term: string;
    declare weekDays: WeekDay[];
}

UserClass.init(
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
            onDelete: "CASCADE",
        },
        courseID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        term: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        weekDays: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: false,
                name: "user_class_index",
                fields: ["userID", "name", "startDate", "endDate", "term"],
            },
        ],
    },
);
