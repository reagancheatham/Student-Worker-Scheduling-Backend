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
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";

export class ShiftOfferRequest extends Model<
    InferAttributes<ShiftOfferRequest>,
    InferCreationAttributes<ShiftOfferRequest>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare employeeMessage: string;
    declare claimingEmployeeID: number;
    declare timeSent: Date;
    declare status: string;
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
        status: {
            type: DataTypes.ENUM("Pending", "Approved", "Denied"),
            allowNull: true,
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
            ScheduleDatabase.create(ShiftOfferRequest, req, res),
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
        router.get("/available/:businessID", this.getAllRequestsForBusiness);
        router.get(
            "/pending/:businessID",
            this.getAllPendingRequestsForBusiness,
        );
    }

    private async getAllRequestsForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        await ShiftOfferRequest.findAll({
            where: { status: null },
            logging: true,
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
