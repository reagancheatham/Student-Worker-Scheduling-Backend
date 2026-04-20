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
import { Logger } from "../classes/util/logger.ts";
import { User } from "./user.ts";
import { ShiftTradeRequestNotification } from "./shiftTradeRequestNotification.ts";
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
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
        },
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
        router.get("/available/:businessID", this.getAllRequestsForBusiness);
        router.get(
            "/pending/:businessID",
            this.getAllPendingRequestsForBusiness,
        );
    }

    private async getAllRequestsForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        await ShiftTradeRequest.findAll({
            where: { status: "Unsubmitted" },
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
            where: { status: "Pending" },
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
}

export const shiftTradeRequestRouter = new ShiftTradeRequestRouter();
