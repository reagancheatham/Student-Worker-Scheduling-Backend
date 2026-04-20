import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";

export class TimeOffRequestNotification extends Model<
    InferAttributes<TimeOffRequestNotification>,
    InferCreationAttributes<TimeOffRequestNotification>
> {
    declare id: CreationOptional<number>;
    declare timeOffRequestID: number;
    declare dismissed: CreationOptional<boolean>;
}

TimeOffRequestNotification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        timeOffRequestID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "TimeOffRequests",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        dismissed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["id", "timeOffRequestID", "dismissed"],
                name: "timeOffRequestNotificationIndex",
            },
        ],
    },
);
