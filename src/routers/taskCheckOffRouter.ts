import { Request, Router } from "express";
import {
    IDResolver,
    userBusinessAuth,
    businessAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Shift } from "../models/shift.ts";
import { Task } from "../models/task.ts";
import { TaskCheckOff } from "../models/taskCheckOff.ts";
import { TaskList } from "../models/taskList.ts";
import { User } from "../models/user.ts";

const idResolver: IDResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) id = req.body?.id;
    if (!id) return undefined;

    try {
        const checkOff = await TaskCheckOff.findOne({
            where: { id },
            include: [
                {
                    model: Task,
                    include: [
                        {
                            model: TaskList,
                            include: [
                                {
                                    model: Shift,
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        return (checkOff as any)?.Task?.TaskList?.Shift?.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${TaskCheckOff.name}: ${error}`);
        return undefined;
    }
};

const taskIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.taskID;

    if (!id) id = req.body?.taskID;
    if (!id) return undefined;

    const task = await Task.findOne({
        where: { id },
        include: [
            {
                model: TaskList,
                include: [
                    {
                        model: Shift,
                    },
                ],
            },
        ],
    });

    return (task as any)?.TaskList?.Shift?.businessID;
};

const employeeIDUserResolver: IDResolver = async (req: Request) => {
    const id = req.body?.sourceEmployeeID;

    if (!id) return undefined;

    const employee = await Employee.findOne({
        where: { id },
        include: { model: User, attributes: ["id"], required: true },
    });

    return (employee as any)?.User?.id;
};

const idUserResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const checkOff = await TaskCheckOff.findOne({
        where: { id },
        include: [
            {
                model: Employee,
                include: [
                    {
                        model: User,
                        attributes: ["id"],
                    },
                ],
            },
        ],
    });

    return (checkOff as any)?.Employee?.User?.id;
};

class TaskCheckOffRouter extends ModelRouter {
    public path(): string {
        return "/taskCheckOffs";
    }

    protected buildRouter(router: Router): void {
        router.post(
            "/",
            userBusinessAuth(taskIDResolver, employeeIDUserResolver),
            (req, res) => ScheduleDatabase.create(TaskCheckOff, req, res),
        );
        router.put(
            "/",
            userBusinessAuth(taskIDResolver, employeeIDUserResolver),
            (req, res) => ScheduleDatabase.update(TaskCheckOff, req, res, "id"),
        );
        router.delete(
            "/:id",
            userBusinessAuth(idResolver, idUserResolver),
            (req, res) => ScheduleDatabase.delete(TaskCheckOff, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.getWhere(
                TaskCheckOff,
                req,
                res,
                {
                    include: {
                        model: Employee,
                        include: [User],
                    },
                },
                "id",
            ),
        );
        router.get("/task/:taskID", businessAuth(taskIDResolver), (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskCheckOff,
                req,
                res,
                {
                    include: [
                        {
                            model: Employee,
                            include: [User],
                        },
                    ],
                },
                "taskID",
            ),
        );
    }
}

export const taskCheckOffRouter = new TaskCheckOffRouter();
