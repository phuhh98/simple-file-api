import express from "express";
import morgan from "morgan";

import path from "path";
import fs from "fs";

import appRouter from "./routers/appRouter";
import { ClientError } from "./types/messages";

const app = express();

// Parse json body
app.use(express.json());

// Create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, ".log"), {
  flags: "a",
});
// Setup the logger with morgan; Apache style
app.use(morgan("combined", { stream: accessLogStream }));

// Routing
app.use("/", appRouter);

// Return error on any wrong path request
app.all("*", (req, res) => {
  const message: ClientError = {
    message: "Client error",
  };
  res.status(400).json(message);
});

export default app;
