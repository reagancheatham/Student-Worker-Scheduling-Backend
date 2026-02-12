import { Sequelize } from "sequelize";
import { databaseConfig } from "./databaseConfig.ts";

console.log("test");
export const sequelizeInstance = new Sequelize(
    databaseConfig.databaseName,
    databaseConfig.user,
    databaseConfig.password,
    {
        host: "localhost",
        port: +databaseConfig.port,
        dialect: "mysql",
    }
);
