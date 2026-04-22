import { Logger } from "../classes/util/logger.ts";
import { PermissionRole } from "../models/permissionRole.ts";
import { BusinessPermissionRole } from "../models/businessPermissionRole.ts";
import { Sequelize } from "sequelize";

export async function initializeSequelize(
    sequelizeInstance: Sequelize,
): Promise<void> {
    try {
        await sequelizeInstance.sync();

        Logger.log(`Successfully synced database.`);

        const promises = [];

        promises.push(PermissionRole.findOrCreate({ where: { name: "User" } }));
        promises.push(
            PermissionRole.findOrCreate({ where: { name: "Admin" } }),
        );
        promises.push(
            BusinessPermissionRole.findOrCreate({
                where: { name: "Employee" },
            }),
        );
        promises.push(
            BusinessPermissionRole.findOrCreate({
                where: { name: "Manager" },
            }),
        );
        promises.push(
            BusinessPermissionRole.findOrCreate({
                where: { name: "Owner" },
            }),
        );

        await Promise.all(promises);

        Logger.log("Successfully initialized database.");
    } catch (error) {
        Logger.error(`Error initializing sequelize: ${error}`);
    }
}
