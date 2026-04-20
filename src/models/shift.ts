import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { Business } from "./business.ts";
import { EventColor } from "../classes/eventColor.ts";
import { Role } from "./role.ts";

export class Shift extends Model<
    InferAttributes<Shift>,
    InferCreationAttributes<Shift>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare employeeID: CreationOptional<number>;
    declare targetRoleID: CreationOptional<number>;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare color: EventColor;
    declare published: boolean;
}

Shift.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "SET NULL",
        },
        targetRoleID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Role,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        color: {
            type: DataTypes.ENUM(...Object.values(EventColor)),
            allowNull: false,
        },
        published: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                fields: [
                    "name",
                    "startTime",
                    "endTime",
                    "businessID",
                    "color",
                    "published",
                ],
            },
        ],
    },
);
