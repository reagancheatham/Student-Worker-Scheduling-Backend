import express from "express";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import { databaseConfig } from "./config/databaseConfig.ts";
import { globalRouter } from "./routes/router.ts";

const app = express();
app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(globalRouter);

const port = databaseConfig.port;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
