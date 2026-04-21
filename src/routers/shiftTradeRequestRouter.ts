import { Request, Response, Router } from "express";
import { IDResolver, userBusinessAuth, businessAuth } from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { Shift } from "../models/shift.ts";
import { ShiftTradeRequest } from "../models/shiftTradeRequest.ts";
import { User } from "../models/user.ts";
import { ShiftTradeRequestNotification } from "../models/shiftTradeRequestNotification.ts";

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const tradeRequest = await ShiftTradeRequest.findOne({
        where: { id },
        include: Shift,
    });

    return (tradeRequest as any)?.Shift?.businessID;
};

const shiftIDResolver: IDResolver = async (req: Request) => {
    let id = req.params?.shiftID;

    if (!id) id = req.body?.shiftID;

    if (!id) return undefined;

    const shift = await Shift.findOne({ where: { id } });

    return shift?.businessID;
};

const userIDResolver: IDResolver = async (req: Request) => {
    let shiftID = req.body?.shiftID;

    if (!shiftID) {
        const id = req.params?.id;

        if (!id) return undefined;

        const tradeRequest = await ShiftTradeRequest.findOne({ where: { id } });

        if (!tradeRequest) return undefined;

        shiftID = tradeRequest?.shiftID?.toString();
    }

    if (!shiftID) return undefined;

    const shift = await Shift.findOne({
        where: { id: shiftID },
        include: [
            {
                model: Employee,
                include: [
                    {
                        model: User,
                        attributes: ["id"],
                    },
                ],
            },
        ],
    });

    return (shift as any)?.Employee?.User?.id;
};

class ShiftTradeRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftTradeRequests";
    }

    protected buildRouter(router: Router): void {
        router.post(
            "/",
            userBusinessAuth(shiftIDResolver, userIDResolver),
            (req, res) => ScheduleDatabase.create(ShiftTradeRequest, req, res),
        );
        router.put(
            "/",
            userBusinessAuth(shiftIDResolver, userIDResolver),
            (req, res) =>
                ScheduleDatabase.update(ShiftTradeRequest, req, res, "id"),
        );
        router.delete(
            "/:id",
            userBusinessAuth(idResolver, userIDResolver),
            (req, res) =>
                ScheduleDatabase.delete(ShiftTradeRequest, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequest, req, res, "id"),
        );
        router.get(
            "/shift/:shiftID",
            businessAuth(shiftIDResolver),
            (req, res) =>
                ScheduleDatabase.get(ShiftTradeRequest, req, res, "shiftID"),
        );
        router.get("/available/:businessID", businessAuth(), this.getAllRequestsForBusiness);
        router.get("/pending/:businessID", businessAuth(), this.getAllPendingRequestsForBusiness);
        router.put("/approve", userBusinessAuth(shiftIDResolver, userIDResolver), (req, res) =>
            ShiftTradeRequestRouter.approveRequest(req, res),
        );
        router.put("/deny", userBusinessAuth(shiftIDResolver, userIDResolver), (req, res) =>
            ShiftTradeRequestRouter.denyRequest(req, res),
        );
    }

    private async getAllRequestsForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        await ShiftTradeRequest.findAll({
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
                                    attributes: ["firstName", "lastName"],
                                },
                            ],
                        },
                    ],
                },
            ],
        })
            .then((results) => {
                Logger.log(
                    `Successfully got ${ShiftTradeRequest.name}s for business ${businessID}: ${JSON.stringify(results)}`,
                );

                res.status(200).send({ results });
            })
            .catch((error) => {
                Logger.error(
                    `Error finding ${ShiftTradeRequest.name}s for business ${businessID}: ${error}`,
                );

                res.status(500).send({ error });
            });
    }

    private async getAllPendingRequestsForBusiness(
            req: Request,
            res: Response,
        ) {
            const businessID = req.params["businessID"];
    
            await ShiftTradeRequest.findAll({
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
                                        attributes: ["firstName", "lastName"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            })
                .then((results) => {
                    Logger.log(
                        `Successfully got ${ShiftTradeRequest.name}s for business ${businessID}: ${JSON.stringify(results)}`,
                    );
    
                    res.status(200).send({ results });
                })
                .catch((error) => {
                    Logger.error(
                        `Error finding ${ShiftTradeRequest.name}s for business ${businessID}: ${error}`,
                    );
    
                    res.status(500).send({ error });
                });
        }

    private static async approveRequest(req: Request, res: Response) {
        try {
            const { id } = req.body;

            const shiftTradeRequest = await ShiftTradeRequest.findByPk(id, {
                include: [{ model: Shift, required: true }],
            });

            if (!shiftTradeRequest) {
                return res
                    .status(404)
                    .json({ message: "Shift trade request not found" });
            }

            await Shift.update(
                { employeeID: shiftTradeRequest.targetEmployeeID },
                { where: { id: shiftTradeRequest.shiftID } },
            );

            await ShiftTradeRequestNotification.destroy({
                where: { shiftTradeRequestID: id },
            });

            await shiftTradeRequest.destroy();

            return res.status(200).json({ message: "Shift trade approved" });
        } catch (error: any) {
            Logger.error(
                "Error approving shift trade request:",
                error.message,
            );
            return res.status(500).json({ message: error.message });
        }
    }

    private static async denyRequest(req: Request, res: Response) {
        try {
            const { id } = req.body;
    
            const shiftOfferRequest = await ShiftTradeRequest.findByPk(id);
    
            if (!shiftOfferRequest) {
                return res.status(404).json({ message: "Shift trade request not found" });
            }
    
            await ShiftTradeRequest.update(
                { approvalStatus: "Denied" },
                { where: { id } },
            );
    
            await ShiftTradeRequestNotification.destroy({
                where: { shiftTradeRequestID: id },
            });
    
            return res.status(200).json({ message: "Shift trade denied" });
        } catch (error: any) {
            Logger.error("Error denying shift trade request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }
}

export const shiftTradeRequestRouter = new ShiftTradeRequestRouter();