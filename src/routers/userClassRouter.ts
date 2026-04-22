import { Request, Response, Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { adminAuth } from "../authentication.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { UserClass } from "../models/userClass.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Business } from "../models/business.ts";
import { businessAuth } from "../authorization/businessAuthorization.ts";
import { StudentScheduleServices } from "../services/studentScheduleServices.ts";
import { User } from "../models/user.ts";

class UserClassRouter extends ModelRouter {
    public path(): string {
        return "/userClasses";
    }

    protected buildRouter(router: Router): void {
        router.post("/import", UserClassRouter.importClassesForAllUsers);
        router.post(
            "/import/business",
            businessAuth(),
            UserClassRouter.importClassesForBusiness,
        );
        router.post("/", adminAuth(), (req, res) =>
            ScheduleDatabase.create(UserClass, req, res),
        );
        router.put("/", adminAuth(), (req, res) =>
            ScheduleDatabase.update(UserClass, req, res, "id"),
        );
        router.get("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.get(UserClass, req, res, "id"),
        );
        router.delete("/:id", adminAuth(), (req, res) =>
            ScheduleDatabase.delete(UserClass, req, res, "id"),
        );
        router.get("/user/:userID", adminAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(UserClass, req, res, {}, "userID"),
        );
        router.get(
            "/business/:businessID",
            businessAuth(),
            UserClassRouter.getAllForBusiness,
        );
        router.get(
            "/employee/:employeeID",
            businessAuth(),
            UserClassRouter.getAllForEmployee,
        );
    }

    private static async getAllForBusiness(req: Request, res: Response) {
        const businessID = req.params?.businessID;

        if (!businessID) {
            Logger.error(
                `Could not find businessID when looking for UserClasses!`,
            );
            res.status(500).send({
                message: `Could not find businessID when looking for UserClasses!`,
            });

            return;
        }

        try {
            const result = await UserClass.findAll({
                include: [
                    {
                        model: User,
                        required: true,
                        include: [
                            {
                                model: Employee,
                                required: true,
                                where: {
                                    businessID,
                                },
                                include: [User],
                            },
                        ],
                    },
                ],
            });

            Logger.log(`Found ${result.length} UserClasses`);

            res.status(200).send(result);
        } catch (error: any) {
            Logger.error(`Error finding UserClasses: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async getAllForEmployee(req: Request, res: Response) {
        const employeeID = req.params?.employeeID;

        if (!employeeID) {
            Logger.error(
                `Could not find employeeID when looking for UserClasses!`,
            );
            res.status(500).send({
                message: `Could not find employeeID when looking for UserClasses!`,
            });

            return;
        }

        try {
            const result = await UserClass.findAll({
                include: [
                    {
                        model: User,
                        required: true,
                        include: [
                            {
                                model: Employee,
                                required: true,
                                include: [User],
                            },
                        ],
                    },
                ],
            });

            Logger.log(`Found ${result.length} UserClasses`);

            res.status(200).send(result);
        } catch (error: any) {
            Logger.error(`Error finding UserClasses: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async importClassesForAllUsers(req: Request, res: Response) {
        const term = req.body?.termCode;

        if (!term) {
            Logger.error(`Schedule importing requires a termCode!`);
            res.status(500).send({
                message: `Schedule importing requires a termCode!`,
            });

            return;
        }

        try {
            await StudentScheduleServices.importClassesForAllUsers(term);

            res.status(200).send({});
        } catch (error: any) {
            Logger.error(`Error importing student schedules: ${error}`);

            res.status(500).send({
                message: `Error importing student schedules: ${error}`,
            });
        }
    }

    private static async importClassesForBusiness(req: Request, res: Response) {
        const businessID = req.body?.businessID;
        const term = req.body?.termCode;

        if (!businessID || !term) {
            Logger.error(
                `Schedule importing requires a businessID and a termCode!`,
            );
            res.status(500).send({
                message: `Schedule importing requires a businessID and a termCode!`,
            });

            return;
        }

        try {
            await StudentScheduleServices.importClassesForBusiness(
                businessID,
                term,
            );

            res.status(200).send({});
        } catch (error: any) {
            Logger.error(`Error importing student schedules: ${error}`);

            res.status(500).send({
                message: `Error importing student schedules: ${error}`,
            });
        }
    }
}

export const userClassRouter = new UserClassRouter();
