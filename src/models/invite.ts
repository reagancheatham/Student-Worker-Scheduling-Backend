import { Model, DataTypes } from "sequelize";
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Transaction,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { CodeService } from "../classes/codeService.ts";
import { Employee } from "./employee.ts";
import nodemailer from "nodemailer";
import { Business } from "./business.ts";
import { Logger } from "../classes/util/logger.ts";
import { EmailService } from "../classes/util/emailService.ts";

export class Invite extends Model<
    InferAttributes<Invite>,
    InferCreationAttributes<Invite>
> {
    declare code: string;
    declare email: string;
    declare businessID: CreationOptional<number> | null;
    declare businessPermissionRoleID: number;
    declare intendedBusinessName: string;

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
                email,
                businessID: business.id,
                businessPermissionRoleID,
                intendedBusinessName: business.name,
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

    public static async createOwnerInvite(
        email: string,
        intendedBusinessName: string,
        businessPermissionRoleID: number,
        transaction?: Transaction,
    ) {
        const code = CodeService.generate10DigitCode();

        Logger.log("Creating owner invite (no business yet)");

        return Invite.create(
            {
                code,
                email,
                businessID: null,
                businessPermissionRoleID,
                intendedBusinessName,
            },
            { transaction },
        )
            .then((result) => {
                Logger.log("Successfully created owner invite");
                return { invite: result, code, email, intendedBusinessName };
            })
            .catch((error) => {
                Logger.log(`Error creating owner invite: ${error}`);
                throw error;
            });
    }

    public static async handleInvite(
        email: string,
        code: string,
        userID: number,
    ) {
        const invite = await Invite.findOne({ where: { code, email } }).catch(
            () => null,
        );

        if (!invite) {
            Logger.log("Could not find valid invite");
            return;
        }

        Logger.log("Found invite");

        const rawBusinessID = invite.getDataValue("businessID") as
            | number
            | null;

        try {
            let businessID = invite.businessID;

            if (businessID === null || rawBusinessID === null) {
                const business = await Business.create({
                    name: invite.intendedBusinessName,
                });

                Logger.log(
                    `Created business "${invite.intendedBusinessName}" (id: ${business.id})`,
                );

                businessID = business.id;
            } else {
                await Business.update(
                    { name: invite.intendedBusinessName },
                    { where: { id: businessID } },
                );

                Logger.log(
                    `Applied intended name "${invite.intendedBusinessName}" to business ${businessID}`,
                );
            }

            await Employee.create({
                businessID,
                userID,
                businessPermissionRoleID: invite.businessPermissionRoleID,
            });

            Logger.log(`Added employee to business ${businessID}`);

            await invite.destroy();
        } catch (error) {
            Logger.log(`Error handling invite: ${error}`);
        }
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
                subject: `You've been invited to join ${businessName}!`,
                text: `You've been invited to join ${businessName}. Click here to accept: ${inviteLink}`,
                html: EmailService.buildInviteEmail(businessName, inviteLink),
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
            allowNull: true,
        },
        businessPermissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        intendedBusinessName: {
            type: DataTypes.STRING,
            allowNull: false,
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
