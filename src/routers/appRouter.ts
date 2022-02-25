import express from "express";
import filesRouter from "./api/filesRouter";

const appRouter = express.Router();

appRouter.use("/api/files", filesRouter);

export default appRouter;
