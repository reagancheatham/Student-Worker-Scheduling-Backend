import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { ScheduleDatabase } from "./classes/scheduleDatabase.ts";
import { Session } from "./models/session.ts";
import { User } from "./models/user.ts";
import jwt from "jsonwebtoken";

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
            console.error(`Could not verify user token`)
            res.status(500).send({ valid: false })
        } else {
            const user = await User.findOne({where: {
                email = payload.email
            }})
            await Session.create({
                userID: user.id,
                token: jwt.sign({ id: user.email }, authconfig.secret, {
                        expiresIn: 86400,
                    }),
                expirationTime: 
            })
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
                    res.status(500).send({ valid: false });
                });
        } else {
            console.error(`Unauthorized. No authentication header`);
            res.status(500).send({ valid: false });
        }
    }
}
