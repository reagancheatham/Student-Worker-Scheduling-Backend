import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    Transaction,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { CodeService } from "../classes/codeService.ts";
import { Employee } from "./employee.ts";
import nodemailer from "nodemailer";
import { Business } from "./business.ts";
import { Logger } from "../classes/util/logger.ts";

export class Invite extends Model<
    InferAttributes<Invite>,
    InferCreationAttributes<Invite>
> {
    declare code: string;
    declare email: string;
    declare businessID: number;
    declare businessPermissionRoleID: number;

    public static async createInvite(
        email: string,
        business: Business,
        businessPermissionRoleID: number,
        transaction?: Transaction,
    ) {
        const code = CodeService.generate10DigitCode();

        Logger.log("Creating invite");

        return Invite.create(
            {
                code,
                email: email,
                businessID: business.id,
                businessPermissionRoleID,
            },
            { transaction },
        )
            .then((result) => {
                Logger.log("Successfully created invite");
            
                return {
                    invite: result,
                    code,
                    email,
                    businessName: business.name,
                };
            })
            .catch((error) => {
                Logger.log(`Error creating invite: ${error}`);
                throw error;
            });
    }

    public static async handleInvite(
        email: string,
        code: string,
        userID: number,
    ) {
        await Invite.findOne({ where: { code: code, email: email } })
            .then((result) => {
                if (!result) {
                    Logger.log("Could not find valid invite");
                    return;
                }
                Logger.log("Found invite");
                Employee.create({
                    businessID: result.businessID,
                    userID: userID,
                    businessPermissionRoleID: result.businessPermissionRoleID,
                })
                    .then(() => Logger.log(`Added employee to business`))
                    .catch((error) => {
                        Logger.log(`Error adding employee: ${error}`);
                    });
            })
            .catch(() => {
                Logger.log("Could not find valid invite");
                return;
            });
    }

    public static async sendInviteEmail(
        email: string,
        code: string,
        businessName: string,
    ) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODE_EMAIL,
                pass: process.env.NODE_EMAIL_PASSWORD,
            },
        });

        const inviteLink = `http://${process.env.FRONTEND_URL}/login/${code}`;

        return transporter
            .sendMail({
                from: process.env.NODE_EMAIL,
                to: email,
                subject: "You're invited!",
                text: `You've been invited. Click here to join: ${inviteLink}`,
                html: `
            <h2>You're Invited</h2>
            <p>You have been invited to join ${businessName}.</p>
            <a href="${inviteLink}">Accept Invite</a>
        `,
            })
            .then(() => {
                Logger.log("Invite email sent");
            });
    }
}

Invite.init(
    {
        code: {
            primaryKey: true,
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Businesses",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        businessPermissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: BusinessPermissionRole,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["code", "email"],
                name: "inviteIndex",
            },
        ],
    },
);

class InviteRouter extends ModelRouter {
    public path(): string {
        return "/invites";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Invite, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Invite, req, res, "code"),
        );
        router.delete("/:code", (req, res) =>
            ScheduleDatabase.delete(Invite, req, res, "code"),
        );
        router.get("/:code", (req, res) =>
            ScheduleDatabase.get(Invite, req, res, "code"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(Invite, req, res),
        );
    }
}

export const inviteRouter = new InviteRouter();
