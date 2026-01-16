import { Sequelize } from "sequelize";
import { databaseConfig } from "./databaseConfig.ts";

export const sequelizeInstance = new Sequelize(
    databaseConfig.databaseName,
    databaseConfig.user,
    databaseConfig.password,
    {
        host: "localhost",
        dialect: "mysql",
    }
);
