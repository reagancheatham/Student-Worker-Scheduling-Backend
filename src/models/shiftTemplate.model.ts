import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import { DaysOfWeek } from "../util/DaysOfWeek";
import tasklist
import Employee from "./employee.model";

class ShiftTemplate extends Model<InferAttributes<ShiftTemplate>, InferCreationAttributes<ShiftTemplate>> {
    declare id: CreationOptional<number>;
    declare startDay: DaysOfWeek;
    declare endDay: DaysOfWeek;
    declare startTime: Date;
    declare endTime: Date;
    declare taskListID: number;
    declare lastEmployeeID: number;
}

ShiftTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDay: {
            type: DataTypes.ENUM(...Object.values(DaysOfWeek)),
            allowNull: false,
        },
        endDay: {
            type: DataTypes.ENUM(...Object.values(DaysOfWeek)),
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
        taskListID: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: TaskList,
                key: "id",
            },
        },
        lastEmployeeID: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "Shift",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["startDay", "endDay", "startTime", "endTime", "taskListID", "lastEmployeeID"],
            },
        ],
    },
);

export default ShiftTemplate;
