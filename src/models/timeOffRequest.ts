import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class TimeOffRequest extends Model<
    InferAttributes<TimeOffRequest>,
    InferCreationAttributes<TimeOffRequest>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare reason: string;
    declare startDate: Date;
    declare endDate: Date;
    declare status: ApprovalStatus;
}

TimeOffRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Employee,
                key: "id",
            },
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "employeeID",
                    "reason",
                    "startDate",
                    "endDate",
                    "status",
                ],
                name: "timeOffRequestIndex",
            },
        ],
    },
);

class TimeOffRequestRouter extends ModelRouter {
    public path(): string {
        return "/timeOffRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TimeOffRequest, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                TimeOffRequest,
                req,
                res,
                "employeeID",
                "id",
            ),
        );
        router.delete("/:employeeID/:id", (req, res) =>
            ScheduleDatabase.delete(
                TimeOffRequest,
                req,
                res,
                "employeeID",
                "id",
            ),
        );
        router.get("/:employeeID/:id", (req, res) =>
            ScheduleDatabase.get(TimeOffRequest, req, res, "employeeID", "id"),
        );
        router.get("/:employeeID", (req, res) =>
            ScheduleDatabase.get(TimeOffRequest, req, res, "employeeID"),
        );
    }
}

export const timeOffRequestRouter = new TimeOffRequestRouter();
