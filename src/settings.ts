import express from "express";
import { runDb } from "./db";

export const app = express()
const port = process.env.PORT || 80
;

export const setting = {
    JWT_SECRET: process.env.JWT_SECRET || 'ghbdtn'
}

export const startApp = async () => {
    await runDb();
    app.listen(port, () => {
    console.log("Example app listening on port:" +port.toString());
    });
   };