import 'dotenv/config';

export const databaseConfig = {
    port: process.env.PORT ?? "3136",
    databaseName: process.env.DB_NAME ?? "MISSING",
    user: process.env.DB_USER ?? "MISSING",
    password: process.env.DB_PASSWORD ?? "",
};