import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import Business from "./business.model";

class TaskList extends Model<InferAttributes<TaskList>, InferCreationAttributes<TaskList>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare businessID: number;
}

TaskList.init(
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
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "TaskList",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "businessID"],
            },
        ],
    },
);

export default TaskList;
