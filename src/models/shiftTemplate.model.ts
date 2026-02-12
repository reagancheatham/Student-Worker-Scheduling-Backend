import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import { WeekDay } from "../util/WeekDay";
import TaskList from "./TaskList.model";
import Employee from "./employee.model";
import ScheduleTemplate from "./scheduleTemplate.model";

class ShiftTemplate extends Model<InferAttributes<ShiftTemplate>, InferCreationAttributes<ShiftTemplate>> {
    declare id: CreationOptional<number>;
    declare startDay: WeekDay;
    declare endDay: WeekDay;
    declare startTime: Date;
    declare endTime: Date;
    declare taskListID: number;
    declare lastEmployeeID: number;
    declare scheduleTemplateID: number;
}

ShiftTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDay: {
            type: DataTypes.ENUM(...Object.values(WeekDay)),
            allowNull: false,
        },
        endDay: {
            type: DataTypes.ENUM(...Object.values(WeekDay)),
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
        scheduleTemplateID: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: ScheduleTemplate,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "ShiftTemplate",
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
