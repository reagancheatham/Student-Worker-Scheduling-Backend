import { Request, Response, Router } from "express";
import { Op } from "sequelize";
import {
    IDResolver,
    managerAuth,
    businessAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Shift } from "../models/shift.ts";
import { User } from "../models/user.ts";
import { Role } from "../models/role.ts";
import { TaskList } from "../models/taskList.ts";
import { Task } from "../models/task.ts";
import { TaskCheckOff } from "../models/taskCheckOff.ts";

type ShiftRangeParams = {
    businessID: string;
    startTime: string;
    endTime: string;
};

type ShiftRangeParamsEmployee = {
    employeeID: string;
    startTime: string;
    endTime: string;
};

const shiftIDResolver: IDResolver = async (req: Request) => {
    const id = req.params.id;

    if (!id) return undefined;

    try {
        const shift = await Shift.findOne({ where: { id } });

        if (!shift) return undefined;
        else return shift.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching shift: ${error}`);
        return undefined;
    }
};

const employeeIDResolver: IDResolver = async (req: Request) => {
    const employeeID = req.params.employeeID;

    if (!employeeID) return undefined;

    const employee = await Employee.findOne({ where: { id: employeeID } });

    if (!employee) return undefined;
    else return employee.businessID;
};

const shiftWhere = {
    include: [
        {
            model: Employee,
            include: [User, Role],
        },
        Role,
        {
            model: TaskList,
            include: [
                {
                    model: Task,
                    include: [
                        {
                            model: TaskCheckOff,
                            include: [
                                {
                                    model: Employee,
                                    include: [User],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

class ShiftRouter extends ModelRouter {
    public path(): string {
        return "/shifts";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(), (req, res) =>
            ScheduleDatabase.create(Shift, req, res),
        );
        router.put("/", managerAuth(), (req, res) =>
            ScheduleDatabase.update(Shift, req, res, "id"),
        );
        router.delete("/:id", managerAuth(shiftIDResolver), (req, res) =>
            ScheduleDatabase.delete(Shift, req, res, "id"),
        );
        router.get(
            "/business/:businessID/startTime=:startTime/endTime=:endTime",
            businessAuth(),
            this.getShiftsForBusinessWithinRange,
        );
        router.get(
            "/employee/:employeeID/startTime=:startTime/endTime=:endTime",
            businessAuth(employeeIDResolver),
            (req: any, res) => this.getShiftsForEmployeeWithinRange(req, res),
        );
        router.get(
            "/employee/:employeeID/startTime=:startTime/endTime=:endTime/published",
            businessAuth(employeeIDResolver),
            (req: any, res) =>
                this.getShiftsForEmployeeWithinRange(req, res, true),
        );
        router.get("/:id", businessAuth(shiftIDResolver), (req, res) =>
            ScheduleDatabase.getWhere(Shift, req, res, shiftWhere, "id"),
        );
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(
                Shift,
                req,
                res,
                shiftWhere,
                "businessID",
            ),
        );
    }

    private async getShiftsForBusinessWithinRange(
        req: Request<ShiftRangeParams>,
        res: Response,
    ) {
        const businessID = Number(req.params.businessID);
        const startTime = new Date(req.params.startTime);
        const endTime = new Date(req.params.endTime);

        const where = {
            businessID,
            startTime: {
                [Op.gte]: startTime,
            },
            endTime: {
                [Op.lte]: endTime,
            },
        };

        await Shift.findAll({
            where,
            include: shiftWhere.include,
        })
            .then((result) => {
                Logger.log(`Found ${result.length} ${Shift.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error getting all ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }

    private async getShiftsForEmployeeWithinRange(
        req: Request<ShiftRangeParamsEmployee>,
        res: Response,
        published: boolean = false,
    ) {
        const employeeID = Number(req.params.employeeID);
        const startTime = new Date(req.params.startTime);
        const endTime = new Date(req.params.endTime);

        const where: any = {
            employeeID,
            startTime: {
                [Op.gte]: startTime,
            },
            endTime: {
                [Op.lte]: endTime,
            },
        };

        if (published) where.published = true;

        await Shift.findAll({
            where,
            include: shiftWhere.include,
        })
            .then((result) => {
                Logger.log(`Found ${result.length} ${Shift.name}s`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error getting all ${Shift.name}s: ${error}`);
                res.status(500).send({ error });
            });
    }
}

export const shiftRouter = new ShiftRouter();
