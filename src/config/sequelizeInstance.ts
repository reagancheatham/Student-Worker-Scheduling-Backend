import { Sequelize } from "sequelize";
import { databaseConfig } from "./databaseConfig.ts";
import { Logger } from "../classes/util/logger.ts";

export const sequelizeInstance = new Sequelize({
    dialect: "mysql",
    host: databaseConfig.DB_HOST,
    port: Number(databaseConfig.DB_PORT),
    username: databaseConfig.DB_USER,
    password: databaseConfig.DB_PW,
    database: databaseConfig.DB_NAME,
    logging: Logger.sequelize,
});
