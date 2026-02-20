import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { Business } from "./business.model.ts";

export class ScheduleTemplate extends Model<
    InferAttributes<ScheduleTemplate>,
    InferCreationAttributes<ScheduleTemplate>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare businessID: number;
}

ScheduleTemplate.init(
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
        tableName: "scheduleTemplate",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "businessID"],
            },
        ],
    },
);
