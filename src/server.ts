import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { defaultCorsConfig } from "./config/corsConfig.ts";
import { databaseConfig } from "./config/databaseConfig.ts";
import { globalRouter } from "./routes/router.ts";
import "./models/database.model.ts"
import sequelizeInstance from "./database/sequelizeInstance.ts";
import businessController from "./controllers/business.controller.ts";
import Business from "./classes/business.ts";

const result = dotenv.config()
console.log("DOTENV RESULT:", result);
console.log("CWD:", process.cwd());
console.log("PORT FROM ENV:", process.env.PORT);

const app = express();
app.use(cors(defaultCorsConfig))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(globalRouter);

const port = databaseConfig.port;

sequelizeInstance.sync({alter: true})
  .then(() => {
    console.log('Database tables created successfully!');
  })
  .catch(err => {
    console.error('Unable to create database tables:', err);
  });

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});