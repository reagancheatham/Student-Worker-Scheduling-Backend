import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Transaction,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase as ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Request, Response, Router } from "express";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { Invite } from "./invite.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";

export class Business extends Model<
    InferAttributes<Business>,
    InferCreationAttributes<Business>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

class BusinessRouter extends ModelRouter {
    public path(): string {
        return "/businesses";
    }

    protected buildRouter(router: Router): void {
        router.post("/", async (req, res) => this.post(req, res));
        router.put("/", (req, res) => this.put(req, res));
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Business, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Business, req, res, "id"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(Business, req, res),
        );
    }

    private async put(req: Request, res: Response) {
        const info = req.body;

        if (info === null) {
            console.error(`Error editing Business: info is null`);
            return Promise.resolve();
        }

        const oldOwner = (await Employee.findOne({
            include: [
                {
                    model: User,
                    where: { email: info.email },
                },
            ],
        })) as Employee & { User?: User };

        const isEmailChanged = oldOwner?.User?.email !== info.email;

        console.log(`Editing Business with info: ${JSON.stringify(info)}`);

        await sequelizeInstance.transaction().then((transaction: any) => {
            return Business.update(info, { where: { id: info.business.id } }, {transaction: transaction}).then(
                (result) => {
                    if (result[0] === 0)
                        console.log(`Could not find a business to update`);
                    else console.log(`Updated ${result[0]} businessess`);

                    if (isEmailChanged) {
                        this.invite(info.email, info);
                    }
                    res.status(404).send({ affectedCount: result[0] });
                },
            );
        });
    }

    private async post(req: Request, res: Response) {
        const info = req.body;

        if (info === null) {
            console.error(`Error creating Business: info is null`);
            return Promise.resolve();
        }

        console.log(`Creating Business with info: ${JSON.stringify(info)}`);

        await sequelizeInstance
            .transaction()
            .then((transaction: any) => {
                return Business.create(
                    { name: info.business.name },
                    { transaction: transaction },
                )
                    .then(async (data) => {
                        console.log(`Successfully created Business`);
                        const email = info.email;
                        if (!email || Array.isArray(email)) {
                            console.log("Invalid email param");
                            return res.status(500).send("Invalid email");
                        }
                        return this.invite(email, data, transaction).then(
                            () => data,
                        );
                    })
                    .then((data) => {
                        return transaction.commit().then(() => data);
                    })
                    .then((data) => {
                        console.log("Successful Transaction");
                        res.status(200).send(data);
                    })
                    .catch((error) => {
                        return transaction.rollback().then(() => {
                            console.error("Transaction rolled back:", error);
                            res.status(500).send({ error });
                        });
                    });
            })
            .catch((error: any) => {
                console.log("Failed transaction");
                res.status(500).send({ error });
            });
    }

    private async invite(
        email: string,
        business: Business,
        transaction: Transaction,
    ) {
        return BusinessPermissionRole.findOne({
            where: { name: "Owner" },
            transaction,
        }).then((role) => {
            if (!role) {
                throw new Error("Owner role not found");
            }
            return Invite.createInvite(email, business, role.id, transaction);
        });
    }
}

export const businessRouter = new BusinessRouter();
