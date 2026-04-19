import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Request, Response } from "express";
import { User } from "./user.ts";
import { TimeOffRequestNotification } from "./timeOffRequestNotification.ts";
import { Logger } from "../classes/util/logger.ts";
import { EmployeeUnavailability } from "./employeeUnavailability.ts";

export class TimeOffRequest extends Model<
    InferAttributes<TimeOffRequest>,
    InferCreationAttributes<TimeOffRequest>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare reason: string;
    declare startDate: Date;
    declare endDate: Date;
    declare approvalStatus: ApprovalStatus;
}

TimeOffRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        approvalStatus: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
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
                    "employeeID",
                    "reason",
                    "startDate",
                    "endDate",
                    "approvalStatus",
                ],
                name: "timeOffRequestIndex",
            },
        ],
    },
);
TimeOffRequest.afterCreate(async (timeOffRequest) => {
    await TimeOffRequestNotification.create({
        timeOffRequestID: timeOffRequest.id,
    });
});

class TimeOffRequestRouter extends ModelRouter {
    public path(): string {
        return "/timeOffRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            TimeOffRequestRouter.createTimeOffRequest(req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(TimeOffRequest, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(TimeOffRequest, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(TimeOffRequest, req, res, "id"),
        );
        router.get("/employee/:employeeID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                TimeOffRequest,
                req,
                res,
                {},
                "employeeID",
            ),
        );
        router.get(
            "/business/:businessID",
            TimeOffRequestRouter.getTimeOffRequestForBusiness,
        );
        router.put("/approve", (req, res) =>
            TimeOffRequestRouter.approveRequest(req, res),
        );
        router.put("/deny", (req, res) =>
            TimeOffRequestRouter.denyRequest(req, res),
        );
    }

    private static async approveRequest(req: Request, res: Response) {
        try {
            const { id } = req.body;
            console.log(id);

            const timeOffRequest = await TimeOffRequest.findByPk(id, {
                include: [{ model: Employee, required: true }],
            });

            if (!timeOffRequest) {
                return res
                    .status(404)
                    .json({ message: "Time off request not found" });
            }

            await EmployeeUnavailability.create({
                employeeID: timeOffRequest.employeeID,
                startTime: timeOffRequest.startDate,
                endTime: timeOffRequest.endDate,
            });

            await TimeOffRequestNotification.destroy({
                where: { timeOffRequestID: id },
            });

            await timeOffRequest.destroy();

            return res.status(200).json({ message: "Time off approved" });
        } catch (error: any) {
            console.error("Error approving Time off request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    private static async denyRequest(req: Request, res: Response) {
        try {
            const { id } = req.body;

            const shiftOfferRequest = await TimeOffRequest.findByPk(id);

            if (!shiftOfferRequest) {
                return res
                    .status(404)
                    .json({ message: "Time off request not found" });
            }

            await TimeOffRequest.update(
                { approvalStatus: "Denied" },
                { where: { id } },
            );

            await TimeOffRequestNotification.destroy({
                where: { timeOffRequestID: id },
            });

            return res.status(200).json({ message: "Time off denied" });
        } catch (error: any) {
            console.error("Error denying Time off request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    private static async getTimeOffRequestForBusiness(
        req: Request,
        res: Response,
    ) {
        const businessID = req.params["businessID"];

        Logger.log(`Getting ${Employee.name}s with businessID: ${businessID}`);

        await TimeOffRequest.findAll({
            include: [
                {
                    model: Employee,
                    required: true,
                    where: { businessID },
                    include: [
                        {
                            model: User,
                        },
                    ],
                },
            ],
        })
            .then((result) => {
                Logger.log(`Found ${Employee.name}: ${JSON.stringify(result)}`);
                res.status(200).send(result);
            })
            .catch((error) => {
                Logger.error(`Error finding ${Employee.name}: ${error}`);
                res.status(500).send({ error });
            });
    }

    private static async createTimeOffRequest(req: Request, res: Response) {
        let timeOffRequest = await ScheduleDatabase.create<TimeOffRequest>(
            TimeOffRequest,
            req,
            res,
        );
        if (timeOffRequest != null) {
            TimeOffRequestNotification.create({
                timeOffRequestID: timeOffRequest.id,
            });
        }
    }
}

export const timeOffRequestRouter = new TimeOffRequestRouter();
