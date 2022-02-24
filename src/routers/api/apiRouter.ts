import express from "express";

import fs, { promises as fsPromise } from "fs";
import { RetrieveFilesSuccess, ServerError } from "../../types/messages";

const apiRouter = express.Router();

const DATA_FOLDER = "./data";

apiRouter.get("/files", async (req, res) => {
  try {
    // Init DATA_FOLDER if it was not exist
    if (!fs.existsSync(DATA_FOLDER)) {
      console.log("folder check: ", fs.existsSync(DATA_FOLDER));
      fs.mkdirSync(DATA_FOLDER);
    }
    const files = await fsPromise.readdir(DATA_FOLDER);
    // err = new Error("got error");
    const message: RetrieveFilesSuccess = {
      message: "Success",
      files: files ? files : [],
    };

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    const message: ServerError = {
      message: "ServerErrror",
    };
    res.status(500).json(message);
  }
});

apiRouter.get("/files/:filename", (req, res) => {});

export default apiRouter;
