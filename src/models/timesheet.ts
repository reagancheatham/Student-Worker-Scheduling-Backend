import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";
import { Shift } from "./shift.model.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Timesheet extends Model<
    InferAttributes<Timesheet>,
    InferCreationAttributes<Timesheet>
> {
    declare shiftID: number;
    declare id: CreationOptional<number>;
    declare clockIn: Date;
    declare clockOut: Date;
    declare status: ApprovalStatus;
}

Timesheet.init(
    {
        shiftID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Shift,
                key: "id",
            },
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        clockIn: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        clockOut: {
            type: DataTypes.DATE,
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
                fields: ["shiftID", "clockIn", "clockOut", "status"],
            },
        ],
    },
);

class TimesheetRouter extends ModelRouter {
    public path(): string {
        return "/timesheets";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Timesheet, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Timesheet, req, res, "shiftID", "id"),
        );
        router.delete("/:shiftID/:id", (req, res) =>
            ScheduleDatabase.delete(Timesheet, req, res, "shiftID", "id"),
        );
        router.get("/:shiftID/:id", (req, res) =>
            ScheduleDatabase.get(Timesheet, req, res, "shiftID", "id"),
        );
    }
}

export const timesheetRouter = new TimesheetRouter();