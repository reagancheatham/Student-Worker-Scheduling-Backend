import { Response } from "express";

export class ControllerUtil {
    static success(res: Response, message: string, data: any) {
        console.log(message);

        if (data == null)
            data = {};

        res.status(200).send(data);
    }

    static error(res: Response, message: string) {
        console.error(message);

        res.status(500).send({ message });
    }
}