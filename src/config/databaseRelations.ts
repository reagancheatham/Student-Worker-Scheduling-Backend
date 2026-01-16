import { Sequelize } from "sequelize";
import { sequelizeInstance } from "./sequelizeInstance.ts";

class Database {
    constructor(public sequelizeInstance: Sequelize) {}
}

// Define foreign key relations here

export const database = new Database(sequelizeInstance);