import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import { ApprovalStatus } from "../util/ApprovalStatus";
import Shift from "./shift.model";

class TimeSheet extends Model<InferAttributes<TimeSheet>, InferCreationAttributes<TimeSheet>> {
    declare id: CreationOptional<number>;
    declare startTime: Date;
    declare endTime: Date;
    declare status: ApprovalStatus;
    declare shiftID: number;
}

TimeSheet.init(
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
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: false,
        },
        shiftID: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: Shift,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "TimeSheet",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["startTime", "endTime", "status", "shiftID"],
            },
        ],
    },
);

export default TimeSheet;
