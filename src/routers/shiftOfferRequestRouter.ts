import { Request, Response, Router } from "express";
import { IDResolver, userBusinessAuth, businessAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Shift } from "../models/shift.ts";
import { ShiftOfferRequest } from "../models/shiftOfferRequest.ts";
import { User } from "../models/user.ts";

const offerRequestIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.id;

    if (!id) id = req.body?.id;
    if (!id) return undefined;

    const offerRequest = await ShiftOfferRequest.findOne({
        where: { id },
        include: Shift,
    });

    return (offerRequest as any)?.Shift?.businessID;
};

const shiftIDResolver: IDResolver = async (req: Request) => {
    const id = req.params?.shiftID;

    if (!id) return undefined;

    const shift = await Shift.findOne({ where: { id } });

    return shift?.businessID;
};

const userIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.shiftID;

    if (!id) id = req.body?.shiftID;
    if (!id) return undefined;

    const shift = await Shift.findOne({
        where: { id },
        include: [
            {
                model: Employee,
                include: [
                    {
                        model: User,
                    },
                ],
            },
        ],
    });

    return (shift as any)?.Employee?.User?.id;
};

class ShiftOfferRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftOfferRequests";
    }

    protected buildRouter(router: Router): void {
        router.post(
            "/",
            userBusinessAuth(offerRequestIDResolver, userIDResolver),
            (req, res) => ScheduleDatabase.create(ShiftOfferRequest, req, res),
        );
        router.put(
            "/",
            userBusinessAuth(offerRequestIDResolver, userIDResolver),
            (req, res) =>
                ScheduleDatabase.update(ShiftOfferRequest, req, res, "id"),
        );
        router.delete(
            "/:id",
            userBusinessAuth(offerRequestIDResolver, userIDResolver),
            (req, res) =>
                ScheduleDatabase.update(ShiftOfferRequest, req, res, "id"),
        );
        router.get("/:id", businessAuth(offerRequestIDResolver), (req, res) =>
            ScheduleDatabase.get(ShiftOfferRequest, req, res, "id"),
        );
        router.get(
            "/shift/:shiftID",
            businessAuth(shiftIDResolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    ShiftOfferRequest,
                    req,
                    res,
                    {},
                    "shiftID",
                ),
        );
        router.get(
            "/business/:businessID",
            businessAuth(),
            this.getAllRequestsForBusiness,
        );
    }

    private async getAllRequestsForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        await ShiftOfferRequest.findAll({
            include: [
                {
                    model: Shift,
                    required: true,
                    where: { businessID },
                },
            ],
        })
            .then((results) => {
                Logger.log(
                    `Successfully got ${ShiftOfferRequest.name}s for business ${businessID}: ${JSON.stringify(results)}`,
                );

                res.status(200).send({ results });
            })
            .catch((error) => {
                Logger.error(
                    `Error finding ${ShiftOfferRequest.name}s for business ${businessID}: ${error}`,
                );

                res.status(500).send({ error });
            });
    }
}

export const shiftOfferRequestRouter = new ShiftOfferRequestRouter();