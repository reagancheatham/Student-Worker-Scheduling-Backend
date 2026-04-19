import { Request, Response, NextFunction } from "express";
import { isAdmin } from "../authentication.ts";
import { Logger } from "../classes/util/logger.ts";
import { User } from "../models/user.ts";
import { Employee } from "../models/employee.ts";
import { BusinessPermissionRole } from "../models/businessPermissionRole.ts";

export type IDResolver = (req: Request) => Promise<number | undefined>;

const fromRequest: IDResolver = async (req: Request) => {
    let businessID = await fromParams(req);

    if (businessID) return businessID;

    businessID = await fromBody(req);

    return businessID;
};

const fromParams: IDResolver = async (req: Request) => {
    const result = Number(req.params?.businessID);

    if (isNaN(result)) return undefined;
    else return result;
};

const fromBody: IDResolver = async (req: Request) => {
    const result = Number(req.body?.businessID);

    if (isNaN(result)) return undefined;
    else return result;
};

export function businessAuth(
    resolver: IDResolver = fromRequest,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = getUser(req);

        if (!user) {
            Logger.error("No valid user in request.");
            res.status(401).send({ valid: false });

            return;
        }

        const admin = await isAdmin(user);

        if (admin) {
            next();
            return;
        }

        try {
            const employee = await getEmployeeFromResolver(user, req, resolver);

            if (employee) next();
            else {
                Logger.error("Request not made from employee!");
                res.status(401).send({ valid: false });

                return;
            }
        } catch (error) {
            Logger.error(`Unauthorized to edit business at path: ${req.path}.`);
            res.status(401).send({ valid: false });
        }
    };
}

export function managerAuth(
    resolver: IDResolver = fromRequest,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = getUser(req);

        if (!user) {
            Logger.error("No valid user in request.");
            res.status(401).send({ valid: false });

            return;
        }

        try {
            const employee = await getEmployeeFromResolver(user, req, resolver);

            if (!employee) {
                Logger.error(
                    `Could not find ${Employee.name} for user: ${user.id}`,
                );
                res.status(401).send({ valid: false });

                return;
            }

            const permissionRole = await BusinessPermissionRole.findOne({
                where: { id: employee.businessPermissionRoleID },
            });

            if (!permissionRole) {
                Logger.error(
                    `Could not find ${BusinessPermissionRole.name} for user: ${user.id}`,
                );
                res.status(401).send({ valid: false });

                return;
            }

            if (
                permissionRole.name === "Manager" ||
                permissionRole.name === "Owner"
            )
                next();
            else {
                Logger.error(
                    `User ${user.id} is not a manager for the target business!`,
                );
                res.status(401).send({ valid: false });
            }
        } catch (error: any) {
            Logger.error(
                `Unauthorized to edit business as manager at path: ${req.path}`,
            );
            res.status(401).send({ valid: false });
        }
    };
}

export function userBusinessAuth(
    businessResolver: IDResolver,
    userResolver: IDResolver,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = getUser(req);

        if (!user) {
            Logger.error("No valid user in request.");
            res.status(401).send({ valid: false });

            return;
        }

        const admin = await isAdmin(user);

        if (admin) {
            next();
            return;
        }

        try {
            const userID = await userResolver(req);

            if (user.id !== userID) {
                Logger.error(
                    `User-specific request is not coming from correct user!`,
                );
                res.status(401).send({ valid: false });

                return;
            }

            const businessAuthorization = businessAuth(businessResolver);
            businessAuthorization(req, res, next);
        } catch (error: any) {
            Logger.error(`Could not resolver userID from ${req.path}`);
            res.status(401).send({ valid: false });

            return;
        }
    };
}

function getUser(req: Request): User | undefined {
    return (req as any).user;
}

async function getEmployeeFromResolver(
    user: User,
    req: Request,
    resolver: IDResolver,
): Promise<Employee | null> {
    const businessID = await resolver(req);

    if (!businessID) {
        Logger.error("No business ID included in request.");
        return null;
    }

    const employee = await Employee.findOne({
        where: { userID: user.id, businessID },
    });

    return employee;
}
