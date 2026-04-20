import { Request, Response, Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { TimeOffRequest } from "../models/timeOffRequest.ts";
import { User } from "../models/user.ts";
import { EmployeeUnavailability } from "../models/employeeUnavailability";
import { TimeOffRequestNotification } from "../models/timeOffRequestNotification.ts";

class TimeOffRequestRouter extends ModelRouter {
    public path(): string {
        return "/timeOffRequests";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TimeOffRequest, req, res),
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
        router.get("/business/:businessID", this.getTimeOffRequestForBusiness);
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
            Logger.log(id);

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
            Logger.error("Error approving Time off request:", error.message);
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
            Logger.error("Error denying Time off request:", error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    private async getTimeOffRequestForBusiness(req: Request, res: Response) {
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
}

export const timeOffRequestRouter = new TimeOffRequestRouter();
