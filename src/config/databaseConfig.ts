import * as dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import { sequelizeInstance } from "./sequelizeInstance.ts";

let port: string = process.env.PORT ?? "3000";
let databaseName: string = process.env.DATABASE_NAME ?? "MISSING";
let user: string = process.env.USER ?? "MISSING";
let password: string = process.env.PASSWORD ?? "";

class DatabaseConfiguration {
    constructor(
        public port: string,
        public databaseName: string,
        public user: string,
        public password: string
    ) {}
}

class Database {
    public config: DatabaseConfiguration;

    constructor(public sequelizeInstance: Sequelize) {
        this.config = new DatabaseConfiguration(port, databaseName, user, password);
    }

    initializeSequelize() {
        sequelizeInstance.sync({ alter: true });
    }
}

export const database = new Database(sequelizeInstance);