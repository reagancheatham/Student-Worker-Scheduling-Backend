import type { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { ScheduleDatabase } from "./classes/scheduleDatabase.ts";
import { Session } from "./models/session.ts";
import { User } from "./models/user.ts";
import jwt from "jsonwebtoken";

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
            const user = await User.findOne({
                where: {
                    email: payload.email,
                },
            });

            const expirationTime = new Date();
            expirationTime.setDate(Date.now() + EXPIRATION_WINDOW * 1000);
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
            console.error(`Created New Session`);
            res.status(200).send({ token: token, valid: true });
        }
    }

    static async validateSession(req: Request, res: Response) {
        const authHeader = req.header("authentication");

        if (authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);

            Session.findOne({ where: { token: token } })
                .then((result) => {
                    console.log(`Found ${token}: ${JSON.stringify(result)}`);
                    res.status(200).send({ valid: true });
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

    static async validateRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {}

    static tryGetToken(req: Request): { valid: boolean; token: string | null } {
        const authHeader = req.header("authentication");

        if (authHeader.startsWith("Bearer ")) {
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
        return { valid: false, token: null};
    }
}
