import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ShiftOfferRequestNotification } from "./shiftOfferRequestNotification.ts";
import { Logger } from "../classes/util/logger.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";

export class ShiftOfferRequest extends Model<
    InferAttributes<ShiftOfferRequest>,
    InferCreationAttributes<ShiftOfferRequest>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare employeeMessage: string;
    declare claimingEmployeeID: number;
    declare timeSent: Date;
    declare approvalStatus: ApprovalStatus;
}

ShiftOfferRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shift,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        employeeMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        claimingEmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        timeSent: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        approvalStatus: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: false,
            defaultValue: ApprovalStatus.Pending,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["employeeMessage", "timeSent", "shiftID"],
            },
        ],
    },
);

class ShiftOfferRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftOfferRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ShiftOfferRequestRouter.createShiftOfferRequest(req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                ShiftOfferRequest,
                req,
                res,
                "shiftID",
                "id",
            ),
        );
        router.delete("/:shiftID/:id", (req, res) =>
            ScheduleDatabase.update(
                ShiftOfferRequest,
                req,
                res,
                "shiftID",
                "id",
            ),
        );
        router.get("/:shiftID/:id", (req, res) =>
            ScheduleDatabase.get(ShiftOfferRequest, req, res, "shiftID", "id"),
        );
        router.get("/:shiftID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftOfferRequest,
                req,
                res,
                {},
                "shiftID",
            ),
        );
        router.get("/business/:businessID", this.getAllRequestsForBusiness);
        router.put("/approve", (req, res) =>
            ShiftOfferRequestRouter.approveRequest(req, res),
        );
        router.put("/deny", (req, res) =>
            ShiftOfferRequestRouter.denyRequest(req, res),
        );
    }

    private static async createShiftOfferRequest(req: Request, res: Response) {
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
            Logger.error(
                "Error approving shift offer request:",
                error.message,
            );
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
