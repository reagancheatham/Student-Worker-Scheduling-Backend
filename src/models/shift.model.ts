import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import Employee from "./employee.model";

class Shift extends Model<InferAttributes<Shift>, InferCreationAttributes<Shift>> {
    declare id: CreationOptional<number>;
    declare startTime: Date;
    declare endTime: Date;
    declare taskListID: number;
    declare employeeID: number;
}

Shift.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        employeeID: {
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
                fields: ["startTime", "endTime", "taskListID", "employeeID"],
            },
        ],
    },
);

export default Shift;
