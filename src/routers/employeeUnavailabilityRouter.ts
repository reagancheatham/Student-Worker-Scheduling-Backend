import type { Request, Response } from "express";
import { Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { EmployeeUnavailability } from "../models/employeeUnavailability.ts";
import { Employee } from "../models/employee.ts";
import {
    businessAuth,
    IDResolver,
} from "../authorization/businessAuthorization.ts";
import { Logger } from "../classes/util/logger.ts";
import { Business } from "../models/business.ts";

const employeeIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.employeeID;

    if (!id) id = req.body?.employeeID;
    if (!id) return undefined;

    const employee = await Employee.findOne({ where: { id } });

    return employee?.businessID;
};

const idResolver: IDResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) return undefined;

    const unavailability = await EmployeeUnavailability.findOne({
        where: { id },
        include: { model: Employee, attributes: ["businessID"] },
    });

    return (unavailability as any)?.Employee?.businessID;
};

class EmployeeUnavailabilityRouter extends ModelRouter {
    public path(): string {
        return "/employeeUnavailabilities";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(employeeIDResolver), (req, res) =>
            ScheduleDatabase.create(EmployeeUnavailability, req, res),
        );
        router.put("/", businessAuth(employeeIDResolver), (req, res) =>
            ScheduleDatabase.update(EmployeeUnavailability, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(EmployeeUnavailability, req, res, "id"),
        );
        router.delete("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(EmployeeUnavailability, req, res, "id"),
        );
        router.get(
            "/employee/:employeeID",
            businessAuth(employeeIDResolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    EmployeeUnavailability,
                    req,
                    res,
                    {},
                    "employeeID",
                ),
        );
        router.get(
            "/business/:businessID",
            businessAuth(),
            EmployeeUnavailabilityRouter.getAllForBusiness,
        );
    }

    private static async getAllForBusiness(req: Request, res: Response) {
        const businessID = req.params?.businessID;

        if (!businessID) {
            Logger.error(
                `Could not find businessID when looking for EmployeeUnavailabilities!`,
            );
            res.status(500).send({
                message: `Could not find businessID when looking for EmployeeUnavailabilities!`,
            });

            return;
        }

        try {
            const result = await EmployeeUnavailability.findAll({
                include: [
                    {
                        model: Employee,
                        required: true,
                        include: [
                            {
                                model: Business,
                                where: {
                                    id: businessID,
                                },
                                attributes: [],
                            },
                        ],
                        attributes: [],
                    },
                ],
            });

            Logger.log(`Found ${result.length} EmployeeUnavailabilities`);

            res.status(200).send(result);
        } catch (error: any) {
            Logger.log(`Error finding EmployeeUnavailabilities: ${error}`);
            res.status(500).send({ error });
        }
    }
}

export const employeeUnavailabilityRouter = new EmployeeUnavailabilityRouter();
