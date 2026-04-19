import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.ts";
import { Employee } from "./employee.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ShiftTradeRequestNotification } from "./shiftTradeRequestNotification.ts";
import { Logger } from "../classes/util/logger.ts";
import { User } from "./user.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";

export class ShiftTradeRequest extends Model<
    InferAttributes<ShiftTradeRequest>,
    InferCreationAttributes<ShiftTradeRequest>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare targetEmployeeID: number;
    declare employeeMessage: string;
    declare timeSent: Date;
    declare approvalStatus: ApprovalStatus;
}

ShiftTradeRequest.init(
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
        targetEmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        employeeMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timeSent: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        approvalStatus: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus))
        }
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "shiftID",
                    "targetEmployeeID",
                    "employeeMessage",
                    "timeSent",
                ],
                name: "shiftTradeRequestIndex",
            },
        ],
    },
);

ShiftTradeRequest.afterCreate(async (shiftTradeRequest) => {
    await ShiftTradeRequestNotification.create({
        shiftTradeRequestID: shiftTradeRequest.id,
    });
});

class ShiftTradeRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftTradeRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(ShiftTradeRequest, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(ShiftTradeRequest, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(ShiftTradeRequest, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequest, req, res, "id"),
        );
        router.get("/shift/:shiftID", (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequest, req, res, "shiftID"),
        );
        router.get("/business/:businessID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftTradeRequestNotification,
                req,
                res,
                {
                    include: [
                        {
                            model: ShiftTradeRequest,
                            required: true,
                            include: [
                                {
                                    model: Shift,
                                    required: true,
                                    include: [
                                        {
                                            model: Employee,
                                            required: true,
                                            where: { businessID: "businessID" },
                                            include: [
                                                {
                                                    model: User,
                                                    required: true,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ),
        );
        router.put("/approve", (req, res) =>
            ShiftTradeRequestRouter.approveRequest(req, res),
        );
        router.put("/deny", (req, res) =>
            ShiftTradeRequestRouter.denyRequest(req, res),
        );
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
            console.error(
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
            console.error("Error denying shift trade request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }
    
}

export const shiftTradeRequestRouter = new ShiftTradeRequestRouter();
