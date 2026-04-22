import { Request, Response, Router } from "express";
import { adminAuth } from "../authentication.ts";
import {
    IDResolver,
    managerAuth,
    businessAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Business } from "../models/business.ts";
import { BusinessPermissionRole } from "../models/businessPermissionRole.ts";
import { Employee } from "../models/employee.ts";
import { Invite } from "../models/invite.ts";
import { User } from "../models/user.ts";
import { Role } from "../models/role.ts";

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const employee = await Employee.findOne({ where: { id } });

    return employee?.businessID;
};

const userIDResolver: IDResolver = async (req: Request) => {
    const userID = req.params?.userID;

    if (!userID) return undefined;

    const employee = await Employee.findOne({ where: { userID } });

    return employee?.businessID;
};

const emailResolver: IDResolver = async (req: Request) => {
    const email = req.params?.email;

    if (!email) return undefined;

    const employee = await Employee.findOne({
        include: { model: User, where: { email }, required: true },
    });

    return employee?.businessID;
};

class EmployeeRouter extends ModelRouter {
    public path(): string {
        return "/employees";
    }

    protected buildRouter(router: Router): void {
        router.get("/owners", adminAuth(), EmployeeRouter.getAllOwners);
        router.post("/invite", managerAuth(), EmployeeRouter.inviteEmployee);
        router.post("/", adminAuth(), (req: any, res: any) =>
            ScheduleDatabase.create(Employee, req, res),
        );
        router.put("/", managerAuth(), (req: any, res: any) =>
            ScheduleDatabase.update(Employee, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req: any, res: any) =>
            ScheduleDatabase.delete(Employee, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req: any, res: any) =>
            ScheduleDatabase.getWhere(
                Employee,
                req,
                res,
                {
                    include: [
                        User,
                        {
                            model: Role,
                            through: { attributes: [] },
                        },
                    ],
                },
                "id",
            ),
        );
        router.get(
            "/user/:userID",
            businessAuth(userIDResolver),
            (req: any, res: any) =>
                ScheduleDatabase.getWhere(
                    Employee,
                    req,
                    res,
                    {
                        include: [
                            User,
                            {
                                model: Role,
                                through: { attributes: [] },
                            },
                        ],
                    },
                    "userID",
                ),
        );
        router.get(
            "/business/:businessID",
            businessAuth(),
            (req: any, res: any) =>
                ScheduleDatabase.getAllWhere(
                    Employee,
                    req,
                    res,
                    {
                        include: [
                            User,
                            {
                                model: Role,
                                through: { attributes: [] },
                            },
                        ],
                    },
                    "businessID",
                ),
        );
        router.get(
            "/user/:userID/business/:businessID",
            businessAuth(),
            (req: any, res: any) =>
                ScheduleDatabase.getWhere(
                    Employee,
                    req,
                    res,
                    {
                        include: [
                            User,
                            {
                                model: Role,
                                through: { attributes: [] },
                            },
                        ],
                    },
                    "userID",
                    "businessID",
                ),
        );
        router.get(
            "/email/:email",
            businessAuth(emailResolver),
            EmployeeRouter.getEmployeeForEmail,
        );
    }

    private static async getAllOwners(req: Request, res: Response) {
        Logger.log(`Getting all Owners`);

        await Employee.findAll({
            include: [
                {
                    model: BusinessPermissionRole,
                    attributes: [],
                    where: { name: "Owner" },
                    required: true,
                },
                Business,
                User,
                {
                    model: Role,
                    through: { attributes: [] },
                },
            ],
        })
            .then((result) => {
                Logger.log(`Found ${Employee.name}: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error finding ${Employee.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    private static async inviteEmployee(req: Request, res: Response) {
        const email = req.body.email;
        const isManager = req.body.isManager;
        const businessID = req.body.businessID;

        let businessPermissionRole = isManager ? "Manager" : "Employee";

        try {
            const permissionRole = await BusinessPermissionRole.findOne({
                where: { name: businessPermissionRole },
            });

            if (!permissionRole) throw Error("Employee role not found!");

            const business = await Business.findOne({
                where: { id: businessID },
            });

            if (!business) throw Error("Business not found!");

            const employee = await Employee.findOne({
                where: { businessID },
                include: {
                    model: User,
                    where: { email },
                    required: true,
                },
            });

            if (employee)
                throw Error(`Employee already exists in business: ${email}`);

            const newInvite = await Invite.createInvite(
                email,
                business,
                permissionRole.id,
            );

            if (newInvite) {
                Invite.sendInviteEmail(
                    newInvite.email,
                    newInvite.code,
                    newInvite.businessName,
                );
            }

            Logger.log("Successfully sent invite!");
            res.status(200).send({ body: "Successfully sent invite!" });
        } catch (error: any) {
            Logger.error(`Error inviting employee: ${error}`);
            res.status(500).send({ error });
        }
    }

    private static async getEmployeeForEmail(req: Request, res: Response) {
        const email = req.params?.email;

        if (!email) {
            Logger.error(`Employee requires email to be passed!`);
            res.status(500).send({});
        }

        try {
            const employee = Employee.findOne({
                include: {
                    model: User,
                    where: { email },
                    required: true,
                },
            });

            Logger.log(`Successfully found employee for email: ${email}`);
            res.status(200).send(employee);
        } catch (error: any) {
            Logger.error(`Error finding employee for email: ${error}`);
            res.status(500).send({ error });
        }
    }
}

export const employeeRouter = new EmployeeRouter();
