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

class EmployeeRouter extends ModelRouter {
    public path(): string {
        return "/employees";
    }

    protected buildRouter(router: Router): void {
        router.get("/owners", adminAuth(), EmployeeRouter.getAllOwners);
        router.post("/", managerAuth(), (req: any, res: any) =>
            EmployeeRouter.createEmployee(req, res),
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
        router.get("/user/:userID", businessAuth(userIDResolver), (req: any, res: any) =>
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
            )
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

    private static async createEmployee(req: Request, res: Response) {
        let email = req.body.email;
        let businessID = req.params.businessID;
        let isManager = req.body.isManager;

        let businessPermissionRole = "Employee";

        if (isManager) {
            businessPermissionRole = "Manager";
        }

        return BusinessPermissionRole.findOne({
            where: { name: businessPermissionRole },
        }).then(async (role) => {
            if (!role) throw new Error("Employee role not found");

            try {
                const business = await Business.findOne({
                    where: { id: businessID },
                });

                const employee = await Employee.findOne({
                    where: { businessID: businessID },
                    include: [
                        {
                            model: User,
                            where: { email: email },
                        },
                        {
                            model: Role,
                            through: { attributes: [] },
                        },
                    ],
                });

                if (!business) {
                    res.status(500).send({ err: "Business not found!" });
                    return;
                }

                if (employee) {
                    res.status(500).send({
                        err: "Employee already exists in business!",
                    });
                    return;
                }

                const newInvite = await Invite.createInvite(
                    email,
                    business,
                    role.id,
                );

                if (newInvite) {
                    Invite.sendInviteEmail(
                        newInvite.email,
                        newInvite.code,
                        newInvite.businessName,
                    );
                }
                res.status(200).send({ body: "Successfully sent invite!" });
                return;
            } catch (err) {
                res.status(500).send({ err });
            }
        });
    }
}

export const employeeRouter = new EmployeeRouter();
