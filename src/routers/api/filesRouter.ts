/* Current path: /api/files */
import express from "express";

import fs, { promises as fsPromise } from "fs";
import {
  Error,
  CreateFileSuccess,
  RetrieveFilesSuccess,
  RetrievedFileData,
} from "../../types/messages";

const filesRouter = express.Router();

const DATA_FOLDER = "./data";

filesRouter.use(checkDataFolderExistence);

filesRouter.get("/", async (req, res) => {
  try {
    const files = await fsPromise.readdir(DATA_FOLDER);
    const message: RetrieveFilesSuccess = {
      message: "Success",
      files: files ? files : [],
    };

    res.status(200).json(message);
  } catch (err) {
    const message: Error = {
      message: "Server error",
    };
    res.status(500).json(message);
  }
});

filesRouter.post("/", async (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename && !content) {
      const message: Error = {
        message: "Please specify 'filename' and 'content' parameters",
      };
      res.status(400).json(message);
      return;
    }
    if (!filename) {
      const message: Error = {
        message: "Please specify 'filename' parameter",
      };
      res.status(400).json(message);
      return;
    }
    if (!content) {
      const message: Error = {
        message: "Please specify 'content' parameter",
      };
      res.status(400).json(message);
      return;
    }

    await fsPromise.writeFile(`${DATA_FOLDER}/${filename}`, content);

    const message: CreateFileSuccess = {
      message: "File created successfully",
    };
    res.status(200).json(message);
  } catch (err) {
    const message: Error = {
      message: "Server error",
    };
    res.status(500).json(message);
  }
});

filesRouter.get("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const tempSplit = filename.split(".");
    const extension = tempSplit[tempSplit.length - 1];

    const files = await fsPromise.readdir(DATA_FOLDER);
    if (files.indexOf(filename) !== -1) {
      const content = await fsPromise.readFile(`${DATA_FOLDER}/${filename}`);
      const fileStat = await fsPromise.stat(`${DATA_FOLDER}/${filename}`);
      const message: RetrievedFileData = {
        message: "Success",
        filename,
        content: content.toString(),
        extension,
        uploadedDate: new Date(fileStat.mtime).toISOString(),
      };

      res.status(200).json(message);
    } else {
      const message: Error = {
        message: `No file with '${filename}' filename found`,
      };
      res.status(400).json(message);
    }
  } catch (err) {
    const message: Error = {
      message: "Server error",
    };
    res.status(500).json(message);
  }
});

function checkDataFolderExistence(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Init DATA_FOLDER if it was not exist
  if (!fs.existsSync(DATA_FOLDER)) {
    fs.mkdirSync(DATA_FOLDER);
  }
  next();
}

export default filesRouter;
