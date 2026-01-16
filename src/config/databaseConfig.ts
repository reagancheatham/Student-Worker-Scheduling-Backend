import * as dotenv from "dotenv";
dotenv.config();

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

export const databaseConfig = new DatabaseConfiguration(port, databaseName, user, password);
