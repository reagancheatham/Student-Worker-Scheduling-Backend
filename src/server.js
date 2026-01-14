import express from "express";
import cors from "cors";
import corsConfig from "./config/corsConfig.js";

var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};