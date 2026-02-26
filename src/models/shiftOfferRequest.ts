import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.model.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class ShiftOfferRequest extends Model<
    InferAttributes<ShiftOfferRequest>,
    InferCreationAttributes<ShiftOfferRequest>
> {
    declare shiftID: number;
    declare id: CreationOptional<number>;
    declare employeeMessage: string;
    declare timeSent: Date;
}

ShiftOfferRequest.init(
    {
        shiftID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Shift,
                key: "id",
            },
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeMessage: {
            type: DataTypes.STRING,
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
                "shiftID",
            ),
        );
        router.get("/business/:businessID", this.getAllRequestsForBusiness);
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
                console.log(
                    `Successfully got ${ShiftOfferRequest.name}s for business ${businessID}: ${JSON.stringify(results)}`,
                );

                res.status(200).send({ results });
            })
            .catch((error) => {
                console.error(
                    `Error finding ${ShiftOfferRequest.name}s for business ${businessID}: ${error}`,
                );

                res.status(500).send({ error });
            });
    }
}

export const shiftOfferRequestRouter = new ShiftOfferRequestRouter();