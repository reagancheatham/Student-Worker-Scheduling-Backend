import 'dotenv/config';

export const databaseConfig = {
    port: process.env.DB_PORT ?? "3306",
    databaseName: process.env.DB_NAME ?? "MISSING",
    user: process.env.DB_USER ?? "MISSING",
    password: process.env.DB_PASSWORD ?? "",
};