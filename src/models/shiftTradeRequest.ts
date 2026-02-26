import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.model.ts";
import { Employee } from "./employee.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Response, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class ShiftTradeRequest extends Model<
    InferAttributes<ShiftTradeRequest>,
    InferCreationAttributes<ShiftTradeRequest>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare targetEmployeeID: number;
    declare employeeMessage: string;
    declare timeSent: Date;
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
            primaryKey: true,
            references: {
                model: Shift,
                key: "id",
            },
        },
        targetEmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
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

class ShiftTradeRequestRouter extends ModelRouter {
    public path(): string {
        return "/shiftTradeRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(ShiftTradeRequest, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                ShiftTradeRequest,
                req,
                res,
                "shiftID",
                "id",
            ),
        );
        router.delete("/:shiftID/:id", (req, res) =>
            ScheduleDatabase.delete(
                ShiftTradeRequest,
                req,
                res,
                "shiftID",
                "id",
            ),
        );
        router.get("/:shiftID/:id", (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequest, req, res, "shiftID", "id"),
        );
        router.get("/:shiftID", (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequest, req, res, "shiftID"),
        );
    }

    private async getAllRequestsForBusiness(req: Request, res: Response) {
        const businessID = req.params["businessID"];

        await ShiftTradeRequest.findAll({
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
                    `Successfully got ${ShiftTradeRequest.name}s for business ${businessID}: ${JSON.stringify(results)}`,
                );

                res.status(200).send({ results });
            })
            .catch((error) => {
                console.error(
                    `Error finding ${ShiftTradeRequest.name}s for business ${businessID}: ${error}`,
                );

                res.status(500).send({ error });
            });
    }
}

export const shiftTradeRequestRouter = new ShiftTradeRequestRouter();