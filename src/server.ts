import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import "./models/database.ts";
import { sequelizeInstance } from "./config/sequelizeInstance.ts";
import { router } from "./router.ts";
import { Logger } from "./classes/util/logger.ts";

const app = express();

sequelizeInstance
    .sync({ alter: true })
    .then(() => {
        Logger.log("Database tables created successfully!");
    })
    .catch((err) => {
        Logger.error("Unable to create database tables:", err);
    });

dotenv.config();

app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use("/workerscheduling-t6", router);

const port = process.env.PORT;
app.listen(port, () => {
    Logger.log(`Server is listening on port ${port}.`);
});
