import { Sequelize } from "sequelize";
import { sequelizeInstance } from "./sequelizeInstance.ts";

class Database {
    constructor(public sequelizeInstance: Sequelize) {}
}

export const database = new Database(sequelizeInstance);