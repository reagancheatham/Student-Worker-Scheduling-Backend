import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance";
import Shift from "./shift.model";
import Employee from "./employee.model";

class ShiftTradeRequest extends Model<
    InferAttributes<ShiftTradeRequest>,
    InferCreationAttributes<ShiftTradeRequest>
> {
    declare id: CreationOptional<number>;
    declare tradeMessage: string;
    declare timeSent: Date;
    declare shiftID: number;
    declare targetEmployeeID: number;
}

ShiftTradeRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tradeMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timeSent: {
            type: DataTypes.DATE,
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
        targetEmployeeID: {
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
        tableName: "ShiftTradeRequest",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "tradeMessage",
                    "timeSent",
                    "shiftID",
                    "targetEmployeeID",
                ],
            },
        ],
    },
);

export default ShiftTradeRequest;
