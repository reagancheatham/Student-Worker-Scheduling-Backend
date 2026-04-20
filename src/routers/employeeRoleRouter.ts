import { Request, Router } from "express";
import {
    IDResolver,
    managerAuth,
} from "../authorization/businessAuthorization.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Role } from "../models/role.ts";
import { EmployeeRole } from "../models/employeeRole.ts";
import { Employee } from "../models/employee.ts";

const roleResolver: IDResolver = async (req: Request) => {
    const id = req.body?.roleID;

    if (!id) return undefined;

    const role = await Role.findOne({ where: { id } });

    return role?.businessID;
};

const idResolver: IDResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const role = await EmployeeRole.findOne({ where: { id }, include: Role });

    return (role as any)?.Role.businessID;
};

const employeeResolver: IDResolver = async (req: Request) => {
    const id = req.params?.employeeID;

    if (!id) return undefined;

    const employee = await Employee.findOne({ where: { id } });

    return employee?.businessID;
};

class EmployeeRoleRouter extends ModelRouter {
    public path(): string {
        return "/roles";
    }

    protected buildRouter(router: Router): void {
        router.post("/", managerAuth(roleResolver), (req, res) =>
            ScheduleDatabase.create(EmployeeRole, req, res),
        );
        router.put("/", managerAuth(roleResolver), (req, res) =>
            ScheduleDatabase.update(EmployeeRole, req, res, "id"),
        );
        router.delete("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(EmployeeRole, req, res, "id"),
        );
        router.get("/:id", managerAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(EmployeeRole, req, res, "id"),
        );
        router.get(
            "/employee/:employeeID",
            managerAuth(employeeResolver),
            (req, res) =>
                ScheduleDatabase.getAllWhere(
                    EmployeeRole,
                    req,
                    res,
                    {},
                    "employeeID",
                ),
        );
    }
}

export const employeeRoleRouter = new EmployeeRoleRouter();
