import type { NextFunction, Request, Response, Router } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { Session } from "./models/session.ts";
import { User } from "./models/user.ts";
import jwt from "jsonwebtoken";
import { ModelRouter } from "./classes/databaseModel.ts";

const DAY_IN_SECONDS = 86400;
const EXPIRATION_WINDOW = 7 * DAY_IN_SECONDS;

export class Authentication {
    static async loginUser(req: Request, res: Response) {
        const googleClientID = process.env.GOOGLE_CLIENT_ID;
        const googleToken = req.body.credential;

        const client = new OAuth2Client(googleClientID);
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: googleClientID,
        });
        const payload = ticket.getPayload();

        if (payload == null) {
            console.error(`Could not verify user token`);
            res.status(500).send({ valid: false });
        } else {
            Authentication.handleLogin(req, res, payload);
        }
    }

    static async logoutUser(req: Request, res: Response) {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ valid: false });
        }

        const token = authHeader.slice(7);

        try {
            const session = await Session.findOne({
                where: { token },
            });

            if (!session) {
                return res.status(404).send({ valid: false });
            }

            await session.destroy();

            console.log(`Session deleted for token: ${token}`);

            return res.status(200).send({ valid: true });
        } catch (error) {
            console.error(`Logout error: ${error}`);
            return res.status(500).send({ valid: false });
        }
    }

    static async handleLogin(
        req: Request,
        res: Response,
        payload: TokenPayload,
    ) {
        const user = await User.findOne({
            where: {
                email: payload.email,
            },
        });

        const expirationTime = new Date(Date.now() + EXPIRATION_WINDOW * 1000);

        if (user && process.env.AUTH_SECRET) {
            const session = await Session.findOne({
                where: {
                    userID: user.id,
                },
            });

            if (session) {
                console.log(`Found Existing Session`);
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

                console.log(`Created New Session`);

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

            this.handleLogin(req, res, payload);
        }
    }

    static async validateSession(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const authHeader = req.header("authentication");

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);

            Session.findOne({ where: { token: token } })
                .then((result) => {
                    console.log(`Found ${token}: ${JSON.stringify(result)}`);
                    res.status(200).send({ valid: true });
                    next();
                })
                .catch((error) => {
                    console.error(`Unauthorized. No token ${token} exists`);
                    res.status(401).send({ valid: false });
                });
        } else {
            console.error(`Unauthorized. No authentication header`);
            res.status(401).send({ valid: false });
        }
    }

    static async tryGetToken(
        req: Request,
    ): Promise<{ valid: boolean; token: string | null }> {
        const authHeader = req.header("authentication");

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);

            Session.findOne({ where: { token: token } })
                .then((result) => {
                    console.log(`Found ${token}: ${JSON.stringify(result)}`);
                    return { valid: true, token: token };
                })
                .catch((error) => {
                    console.error(`Unauthorized. No token ${token} exists`);
                    return { valid: false, token: null };
                });
        }
        console.error(`Unauthorized. No authentication header`);
        return { valid: false, token: null };
    }
}

class AuthenticationRouter extends ModelRouter {
    public path(): string {
        return "/authentication";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            Authentication.loginUser(req, res).catch(next);
        });

        router.post(
            "/logout",
            (req: Request, res: Response, next: NextFunction) => {
                Authentication.logoutUser(req, res).catch(next);
            },
        );

    }
}

export const authenticationRouter = new AuthenticationRouter();
