import express from "express";
import apiRouter from "./api/apiRouter";

const appRouter = express.Router();

appRouter.use("/api", apiRouter);

export default appRouter;
