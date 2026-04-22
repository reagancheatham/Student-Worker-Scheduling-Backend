import { Request, Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Timesheet } from "../models/timesheet.ts";
import { Shift } from "../models/shift.ts";
import {
    IDResolver,
    userBusinessAuth,
} from "../authorization/businessAuthorization.ts";
import { Employee } from "../models/employee.ts";

import { User } from "../models/user.ts";
import { Op } from "sequelize";

const timesheetIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) id = req.body?.id;
    if (!id) return undefined;

    const timesheet = await Timesheet.findOne({
        where: { id },
        include: Shift,
    });

    return (timesheet as any)?.Shift?.businessID;
};

const userIDResolver: IDResolver = async (req: Request) => {
    let employeeID = req.params?.employeeID;

    if (!employeeID) employeeID = req.body?.employeeID;
    if (!employeeID) return undefined;

    const employee = await Employee.findOne({
        where: { id: employeeID },
        include: [{ model: User }],
    });

    return (employee as any)?.User?.id;
};

class TimesheetRouter extends ModelRouter {
    public path(): string {
        return "/timesheets";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Timesheet, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Timesheet, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Timesheet, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Timesheet, req, res, "id"),
        );
        router.get(
            "/employee/:employeeID",
            userBusinessAuth(timesheetIDResolver, userIDResolver),
            (req, res) => {
                const threeWeeksAgo = new Date();
                threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

                ScheduleDatabase.getAllWhere(Timesheet, req, res, {
                    where: {
                        clockIn: {
                            [Op.gte]: threeWeeksAgo,
                        },
                    },
                    include: {
                        model: Shift,
                        where: { employeeID: req.params?.employeeID },
                    },
                    order: [["clockIn", "DESC"]],
                });
            },
        );
    }
}

export const timesheetRouter = new TimesheetRouter();
