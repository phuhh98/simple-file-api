import express from "express";

import fs from "fs";

import { RetrieveFilesSuccess, ServerError } from "../../types/messages";

const apiRouter = express.Router();

const DATA_FOLDER = "./data";

apiRouter.get("/files", (req, res) => {
  fs.readdir(DATA_FOLDER, (err, files) => {
    // err = new Error("got error");
    let message: ServerError | RetrieveFilesSuccess;
    if (!!err) {
      message = {
        message: "ServerErrror",
      };
    } else {
      message = {
        message: "Success",
        files: files ? files : [],
      };
    }

    res.status(200).json(message);
  });
});

apiRouter.get("/files/:filename", (req, res) => {});

export default apiRouter;
