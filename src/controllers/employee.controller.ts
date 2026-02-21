import { Employee } from "../models/employee.model";
import routesUtil from "../util/routesUtil.ts";

export class EmployeeController {
    static async create(req, res) {
        const employeeInfo = req.body;

        console.log(
            `Creating employee with info: ${JSON.stringify(employeeInfo)}.`,
        );

        await Employee.create(employeeInfo)
            .then((data) => {
                routesUtil.success(res, "Successfully created employee", data);
            })
            .catch((err) => {
                routesUtil.error(res, `Error creating business: ${err}`);
            });
    }

    static async update(req, res) {
        const info = req.body;
        const id = info.id;

        console.log(`Updating employee with info: ${JSON.stringify(info)}.`);

        await Employee.update(info, { where: { id } })
            .then((result) => {
                routesUtil.success(
                    res,
                    "Successfully updated employee.",
                    result[0],
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error updating employee: ${err}`);
            });
    }

    static async delete(req, res) {
        const id = req.params.id;

        console.log(`Deleting employee: ${id}.`);

        await Employee.destroy({
            where: {
                id,
            },
        })
            .then(() => {
                routesUtil.success(res, "Successfully deleted employee.", {});
            })
            .catch((err) => {
                routesUtil.error(res, `Error deleting employee: ${err}`);
            });
    }

    static async get(req, res) {
        const id = req.params.id;

        console.log(`Finding Employee: ${id}.`);

        await Employee.findByPk(id)
            .then((employee) => {
                routesUtil.success(
                    res,
                    `Successfully found ability: ${JSON.stringify(employee)}.`,
                    employee,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding employee: ${err}`);
            });
    }

    static async findAllByBusiness(req, res) {
        const id = req.params.id;

        console.log(`Finding employees for business: ${id}`);

        await Employee.findAll({ where: { businessID: id } })
            .then((employees) => {
                routesUtil.success(
                    res,
                    `Successfully found employees: ${JSON.stringify(employees)}.`,
                    employees,
                );
            })
            .catch((err) => {
                routesUtil.error(res, `Error finding employees: ${err}`);
            });
    }
}
