import { Request, Response, Router } from "express";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Logger } from "../classes/util/logger.ts";
import { Employee } from "../models/employee.ts";
import { TimeOffRequest } from "../models/timeOffRequest.ts";
import { User } from "../models/user.ts";

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
