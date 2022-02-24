import express from "express";

const apiRouter = express.Router();

apiRouter.get("/files", (req, res) => {
  res.status(200).json({ status: "ok", path: "/api/files" });
});

export default apiRouter;
