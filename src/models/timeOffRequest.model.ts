import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import { ApprovalStatus } from "../util/ApprovalStatus";
import Employee from "./employee.model";

class TimeOffRequest extends Model<InferAttributes<TimeOffRequest>, InferCreationAttributes<TimeOffRequest>> {
    declare id: CreationOptional<number>;
    declare startDate: Date;
    declare endDate: Date;
    declare timeOffReason: string;
    declare status: ApprovalStatus;
    declare employeeID: number;
}

TimeOffRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        timeOffReason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: false,
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
        tableName: "TimeOffRequest",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["startDate", "endDate", "timeOffReason", "status", "employeeID"],
            },
        ],
    },
);

export default TimeOffRequest;
