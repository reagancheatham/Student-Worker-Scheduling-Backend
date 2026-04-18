import { Request, Response, NextFunction } from "express";
import { isAdmin } from "../authentication.ts";
import { Logger } from "../classes/util/logger.ts";
import { User } from "../models/user.ts";
import { Employee } from "../models/employee.ts";

export type BusinessResolver = (req: Request) => Promise<number | undefined>;

const fromRequest: BusinessResolver = async (req: Request) => {
    let businessID = await fromParams(req);

    if (businessID) return businessID;

    businessID = await fromBody(req);

    return businessID;
};

const fromParams: BusinessResolver = async (req: Request) => {
    const result = Number(req.params?.businessID);

    if (isNaN(result)) return undefined;
    else return result;
};

const fromBody: BusinessResolver = async (req: Request) => {
    const result = Number(req.body?.businessID);

    if (isNaN(result)) return undefined;
    else return result;
};

export function businessAuth(
    resolver: BusinessResolver = fromRequest,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user: User = (req as any).user;

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
            const businessID = await resolver(req);

            if (!businessID) {
                Logger.error("No business ID included in request.");
                res.status(401).send({ valid: false });

                return;
            }

            const membership = await Employee.findOne({
                where: { userID: user.id, businessID },
            });

            if (membership) next();
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
