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
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";

export class ShiftOfferRequest extends Model<
    InferAttributes<ShiftOfferRequest>,
    InferCreationAttributes<ShiftOfferRequest>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare employeeMessage: string;
    declare claimingEmployeeID: number;
    declare timeSent: Date;
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

const offerRequestIDResolver: BusinessResolver = async (req: Request) => {
    let id = req.params.id;

    if (!id) id = req.body.id;
    if (!id) return undefined;

    try {
        const offerRequest = await ShiftOfferRequest.findOne({
            where: { id },
            include: Shift,
        });

        if (!offerRequest || !(offerRequest as any).Shift) return undefined;
        else return (offerRequest as any).Shift.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${ShiftOfferRequest.name}: ${error}`);
        return undefined;
    }
};

const shiftIDResolver: BusinessResolver = async (req: Request) => {
    const id = req.params.shiftID;

    if (!id) return undefined;

    try {
        const shift = await Shift.findOne({ where: { id } });

        if (!shift) return undefined;
        else return shift.businessID;
    } catch (error: any) {
        Logger.error(`Error fetching ${Shift.name}: ${error}`);
        return undefined;
    }
};

class ShiftOfferRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftOfferRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(offerRequestIDResolver), (req, res) =>
            ScheduleDatabase.create(ShiftOfferRequest, req, res),
        );
        router.put("/", businessAuth(offerRequestIDResolver), (req, res) =>
            ScheduleDatabase.update(ShiftOfferRequest, req, res, "id"),
        );
        router.delete("/:id", businessAuth(offerRequestIDResolver), (req, res) =>
            ScheduleDatabase.update(ShiftOfferRequest, req, res, "id"),
        );
        router.get("/:id", businessAuth(offerRequestIDResolver), (req, res) =>
            ScheduleDatabase.get(ShiftOfferRequest, req, res, "id"),
        );
        router.get("/shift/:shiftID", businessAuth(shiftIDResolver), (req, res) =>
            ScheduleDatabase.getAllWhere(
                ShiftOfferRequest,
                req,
                res,
                {},
                "shiftID",
            ),
        );
        router.get(
            "/business/:businessID", businessAuth(),
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
