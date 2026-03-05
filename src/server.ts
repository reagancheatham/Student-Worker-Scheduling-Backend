import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import "./models/database.ts";
import { sequelizeInstance } from "./config/sequelizeInstance.ts";
import { router } from "./router.ts";

const app = express();

// sequelizeInstance
//     .sync({ alter: true })
//     .then(() => {
//         console.log("Database tables created successfully!");
//     })
//     .catch((err) => {
//         console.error("Unable to create database tables:", err);
//     });

const result = dotenv.config();
console.log("DOTENV RESULT:", result);
console.log("CWD:", process.cwd());
console.log("PORT FROM ENV:", process.env.PORT);

app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use("/", router);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
