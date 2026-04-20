import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import "./models/database.ts";
import { sequelizeInstance } from "./config/sequelizeInstance.ts";
import { router } from "./router.ts";
import { Logger } from "./classes/util/logger.ts";
import { initializeSequelize } from "./config/sequelizeInitializer.ts";
import path from "path";

const app = express();
const distPath = path.join(process.cwd(), "dist");

initializeSequelize(sequelizeInstance);
dotenv.config();

app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(distPath))
    .use("/workerscheduling-t6", router)
    .get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });

const port = process.env.NODE_PORT;
app.listen(port, () => {
    Logger.log(`Server is listening on port ${port}.`);
});
