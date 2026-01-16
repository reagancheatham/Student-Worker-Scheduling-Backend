import express from "express";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import { database } from "./config/databaseConfig.ts";
import { globalRouter } from "./routes/router.ts";

database.initializeSequelize();

const app = express();
app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use("/", globalRouter);

const port = database.config.port;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
