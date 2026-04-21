import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import "./models/database.ts";
import { sequelizeInstance } from "./config/sequelizeInstance.ts";
import { router } from "./router.ts";
import { DailyStudentScheduleRefreshService } from "./services/dailyStudentScheduleRefreshService.ts";
import { Logger } from "./classes/util/logger.ts";
import { initializeSequelize } from "./config/sequelizeInitializer.ts";

const app = express();
initializeSequelize(sequelizeInstance);

dotenv.config();

DailyStudentScheduleRefreshService.start();

app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use("/workerscheduling-t6", router);

const port = Number(process.env.NODE_PORT);
app.listen(port, () => {
    Logger.log(`Server is listening on port ${port}.`);
});
