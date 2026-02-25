import type { Request, Response } from "express";


export class AuthenticationController {
    static async login(req: Request, res: Response) {
        const googleToken = req.body.credential;
        let googleUser;

        await verifyToken(googleToken)
            .then((returnUser) => {
                console.log(
                    `Successfully verified Google token: ${Object.entries(
                        returnUser
                    )}.`
                );
                googleUser = returnUser;
            })
            .catch(console.error);

        if (googleUser == null) {
            console.error("Could not verify user token!");
            res.status(500).send({ message: "Could not verify user token!" });
            return;
        }

        // if we don't have their email or name, we need to make another request
        // this is solely for testing purposes
        if (!googleUser.isValid() && req.body.accessToken !== undefined)
            googleUser = getUserForAccessToken(req.body.accessToken);

        await findOrCreateDatabaseUser(googleUser)
            .then((user) => {
                googleUser = user;
            })
            .catch((err) => {
                console.log(`Error while retrieving database user: ${err}.`);
                res.status(500).send({ message: err.message });
            });

        await updateSessionStatus(googleUser)
            .then((userData) => {
                console.log(
                    `Successfully received user data: ${JSON.stringify(
                        userData
                    )}.`
                );

                res.status(200).send(userData);
            })
            .catch((err) => {
                console.log(
                    `Error while updating session status: ${err.message}.`
                );
                res.status(500).send({
                    message: `Error while updating session status: ${err.message}.`,
                });
            });
    },
}