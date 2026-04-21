import { Request, Response, Router } from "express";
import {
    IDResolver,
    userBusinessAuth,
    businessAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Shift } from "../models/shift.ts";
import { ShiftOfferRequest } from "../models/shiftOfferRequest.ts";
import { User } from "../models/user.ts";
import { ShiftOfferRequestNotification } from "../models/shiftOfferRequestNotification.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";

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
            (req, res) =>
                ShiftOfferRequestRouter.createShiftOfferRequest(req, res),
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
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(ShiftOfferRequest, req, res, {
                include: [
                    {
                        model: Shift,
                        required: true,
                        attributes: ["startTime", "endTime"],
                        include: [
                            {
                                model: Employee,
                                required: true,
                                include: [
                                    {
                                        model: User,
                                        required: true,
                                        attributes: ["firstName", "lastName"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }),
        );
        router.get("/available/:businessID", businessAuth(), this.getAllRequestsForBusiness);
        router.get("/pending/:businessID", businessAuth(), this.getAllPendingRequestsForBusiness);
        router.put(
            "/approve",
            userBusinessAuth(offerRequestIDResolver, userIDResolver),
            (req, res) => ShiftOfferRequestRouter.approveRequest(req, res),
        );
        router.put(
            "/deny",
            userBusinessAuth(offerRequestIDResolver, userIDResolver),
            (req, res) => ShiftOfferRequestRouter.denyRequest(req, res),
        );
    }

    private static async createShiftOfferRequest(req: Request, res: Response) {
        try {
            const shiftOfferRequest =
                await ScheduleDatabase.create<ShiftOfferRequest>(
                    ShiftOfferRequest,
                    req,
                    res,
                );

            if (shiftOfferRequest != null) {
                await ShiftOfferRequestNotification.create({
                    shiftOfferRequestID: shiftOfferRequest.id,
                });
            }

            return res
                .status(200)
                .json({ message: "Created Shift Offer Request" });
        } catch (error: any) {
            Logger.error("Error creating shift offer request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    private static async approveRequest(req: Request, res: Response) {
        try {
            const { id } = req.body;
            Logger.log(id);

            const shiftOfferRequest = await ShiftOfferRequest.findByPk(id, {
                include: [{ model: Shift, required: true }],
            });

            if (!shiftOfferRequest) {
                return res
                    .status(404)
                    .json({ message: "Shift offer request not found" });
            }

            await Shift.update(
                { employeeID: null as any },
                { where: { id: shiftOfferRequest.shiftID } },
            );

            await ShiftOfferRequestNotification.destroy({
                where: { shiftOfferRequestID: id },
            });

            await shiftOfferRequest.destroy();

            return res.status(200).json({ message: "Shift offer approved" });
        } catch (error: any) {
            Logger.error("Error approving shift offer request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    private static async denyRequest(req: Request, res: Response) {
        try {
            const { id } = req.body;

            const shiftOfferRequest = await ShiftOfferRequest.findByPk(id);

            if (!shiftOfferRequest) {
                return res
                    .status(404)
                    .json({ message: "Shift offer request not found" });
            }

            await ShiftOfferRequest.update(
                { approvalStatus: "Denied" },
                { where: { id } },
            );

            await ShiftOfferRequestNotification.destroy({
                where: { shiftOfferRequestID: id },
            });

            return res.status(200).json({ message: "Shift offer denied" });
        } catch (error: any) {
            Logger.error("Error denying shift offer request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    private async getAllRequestsForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        await ShiftOfferRequest.findAll({
            where: { approvalStatus: "Unsubmitted" },
            include: [
                {
                    model: Shift,
                    required: true,
                    where: { businessID },
                    attributes: ["startTime", "endTime"],
                    include: [
                        {
                            model: Employee,
                            required: true,
                            include: [
                                {
                                    model: User,
                                    required: true,
                                    attributes: ["firstName", "lastName", "id"],
                                },
                            ],
                        },
                    ],
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

    private async getAllPendingRequestsForBusiness(
        req: Request,
        res: Response,
    ) {
        const businessID = req.params["businessID"];

        await ShiftOfferRequest.findAll({
            where: { approvalStatus: "Pending" },
            include: [
                {
                    model: Shift,
                    required: true,
                    where: { businessID },
                    attributes: ["startTime", "endTime"],
                    include: [
                        {
                            model: Employee,
                            required: true,
                            include: [
                                {
                                    model: User,
                                    required: true,
                                    attributes: ["firstName", "lastName", "id"],
                                },
                            ],
                        },
                    ],
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
