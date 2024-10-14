import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "../config/passport.js";

import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

const app = express();
app.use(cookieParser());
const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      // If the origin is in the allowedOrigins array or there is no origin (i.e., non-browser request), allow the request
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow credentials to be passed along
  })
);
origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(passport.initialize());
import clientRoute from "./routes/client.routes.js";

app.use("/api/v1/client", clientRoute);

//sample backend url
//http://localhost:5217/api/v1/client/login

export default app;
