import type { NextFunction, Request, Response, Router } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { Session } from "./models/session.ts";
import { User } from "./models/user.ts";
import jwt from "jsonwebtoken";
import { ModelRouter } from "./classes/databaseModel.ts";
import { Invite } from "./models/invite.ts";
import { Employee } from "./models/employee.ts";
import { PermissionRole } from "./models/permissionRole.ts";
import { Logger } from "./classes/util/logger.ts";

const DAY_IN_SECONDS = 86400;
const EXPIRATION_WINDOW = 7 * DAY_IN_SECONDS;

export class Authentication {
    public static async loginUser(req: Request, res: Response) {
        const googleClientID = process.env.GOOGLE_CLIENT_ID;
        const googleToken = req.body.credential;
        const code: string | undefined = req.body.code;

        const client = new OAuth2Client(googleClientID);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: googleClientID,
        });
        const payload = ticket.getPayload();

        if (payload == null) {
            Logger.error(`Could not verify user token`);
            res.status(500).send({ valid: false });
        } else Authentication.handleLogin(req, res, payload, code);
    }

    public static async logoutUser(req: Request, res: Response) {
        const authHeader = req.header("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ valid: false });
        }

        const token = authHeader.slice(7);

        try {
            const session = await Session.findOne({
                where: { token },
            });

            if (!session) {
                res.status(401).send({ valid: false });
                return;
            }

            await session.destroy();

            Logger.log(`Session deleted for token: ${token}`);

            res.status(200).send({ valid: true });
            return;
        } catch (error) {
            Logger.error(`Logout error: ${error}`);
            res.status(500).send({ valid: false });
        }
    }

    public static async handleLogin(
        req: Request,
        res: Response,
        payload: TokenPayload,
        code: string | undefined,
    ) {
        const user = await User.findOne({
            where: {
                email: payload.email,
            },
        });

        Logger.log("Found User");

        const expirationTime = new Date(Date.now() + EXPIRATION_WINDOW * 1000);

        if (user && process.env.AUTH_SECRET) {
            if (code) Invite.handleInvite(user.email, code, user.id);

            const session = await Session.findOne({
                where: {
                    userID: user.id,
                },
            });

            if (session) {
                Logger.log(`Found Existing Session`);
                res.status(200).send({
                    token: session.token,
                    valid: true,
                    profilePicture: payload.picture, //??
                    user,
                });
            } else {
                const token = jwt.sign(
                    { id: user.email },
                    process.env.AUTH_SECRET,
                    {
                        expiresIn: EXPIRATION_WINDOW,
                    },
                );

                await Session.create({
                    userID: user.id,
                    token: token,
                    expirationTime: expirationTime,
                });

                Logger.log(`Created New Session`);

                res.status(200).send({
                    token: token,
                    valid: true,
                    profilePicture: payload.picture,
                    user,
                });
            }
        } else {
            await User.create({
                studentID: 111111,
                permissionRoleID: 1,
                firstName: payload.given_name || "",
                lastName: payload.family_name || "",
                email: payload.email || "",
                phoneNumber: "000000",
            });

            this.handleLogin(req, res, payload, code);
        }
    }

    public static async validateSession(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const authHeader = req.header("authorization");

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);

            try {
                const result = await Session.findOne({
                    where: { token },
                    include: User,
                });

                if (!result) {
                    Logger.error(`Unauthorized: No token ${token} exists.`);
                    return res.status(401).send({ valid: false });
                }

                Logger.log(`Found ${token}: ${JSON.stringify(result)}`);
                (req as any).user = (result as any).User;

                return next();
            } catch (error) {
                Logger.error(`Unauthorized: No token ${token} exists.`);
                res.status(401).send({ valid: false, error });
            }
        } else {
            Logger.error(`Unauthorized: No authentication header.`);
            res.status(401).send({ valid: false });
        }
    }

    public static async tryGetToken(
        req: Request,
    ): Promise<{ valid: boolean; token: string | null }> {
        const authHeader = req.header("authentication");

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);

            Session.findOne({ where: { token: token } })
                .then((result) => {
                    Logger.log(`Found ${token}: ${JSON.stringify(result)}`);
                    return { valid: true, token: token };
                })
                .catch((error) => {
                    Logger.error(`Unauthorized. No token ${token} exists`);
                    return { valid: false, token: null };
                });
        }
        Logger.error(`Unauthorized. No authentication header`);
        return { valid: false, token: null };
    }
}

class AuthenticationRouter extends ModelRouter {
    public path(): string {
        return "/authentication";
    }

    protected buildRouter(router: Router): void {
        router.post("/", Authentication.loginUser);
        router.post("/logout", Authentication.logoutUser);
        router.post("/validate", Authentication.validateSession, (req, res) =>
            res.status(200).send({ valid: true }),
        );
    }
}

export async function adminAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const user: User = (req as any).user;
    const admin = await isAdmin(user);

    if (admin) next();
    else res.status(401).send({ valid: false });
}

export async function isAdmin(user: User): Promise<boolean> {
    if (!user) return false;

    try {
        const permissionRole = await PermissionRole.findOne({
            where: { id: user.permissionRoleID },
        });

        if (permissionRole && permissionRole.name === "Admin") return true;
        else return false;
    } catch (error) {
        Logger.error(`Error authenticating admin: ${error}`);
        return false;
    }
}

export const authenticationRouter = new AuthenticationRouter();
