import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import { TaskStatus } from "../util/TaskStatus";

class ShiftTradeRequest extends Model<InferAttributes<ShiftTradeRequest>, InferCreationAttributes<ShiftTradeRequest>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare completeStatus: TaskStatus;
    declare taskListID: number;
}

ShiftTradeRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        completeStatus: {
            type: DataTypes.ENUM(...Object.values(TaskStatus)),
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
    },
    {
        sequelize: sequelizeInstance,
        tableName: "Task",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "completeStatus", "taskListID"],
            },
        ],
    },
);

export default ShiftTradeRequest;
