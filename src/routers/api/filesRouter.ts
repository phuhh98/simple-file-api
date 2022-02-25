/* Current path: /api/files */
import express from "express";

import fs, { promises as fsPromises } from "fs";

import bcrypt from "bcrypt";
import {
  Error,
  CreateFileSuccess,
  RetrieveFilesSuccess,
  RetrievedFileData,
  Message,
  FilePasswordItem,
} from "../../types/messages";

const filesRouter = express.Router();

const DATA_FOLDER = "./data";
const PASSWORD_FILE = "./password.json";
const SALT_ROUND = 10;

filesRouter.use(checkDataFolderExistence);

/* Return list of files in DATA_FOLDER from endpoint GET /api/files */
filesRouter.get("/", async (req, res) => {
  try {
    const files = await fsPromises.readdir(DATA_FOLDER);
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

/* Create a file from endpoint GET /api/files/:password? , with request body of JSON: { filename: string, content: string } */
filesRouter.post("/:password?", async (req, res) => {
  try {
    const { filename, content } = req.body;
    const password = req.params.password;

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

    await fsPromises.writeFile(`${DATA_FOLDER}/${filename}`, content);
    if (!!password) {
      const passwordJSON = await fsPromises.readFile(PASSWORD_FILE);
      const passwordList: FilePasswordItem[] = JSON.parse(
        passwordJSON.toString()
      );
      const existed = passwordList.find(async item => {
        let result = false;
        if (item.filename === filename) {
          result = await bcrypt.compare(password, item.password);
        }
        return result;
      });

      if (!existed) {
        const hash = await bcrypt.hash(password, SALT_ROUND);
        passwordList.push({
          filename,
          password: hash,
        });
        await fsPromises.writeFile(PASSWORD_FILE, JSON.stringify(passwordList));
      }
    }

    const message: CreateFileSuccess = {
      message: `File created successfully${!!password && ` with a password`}`,
    };
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    const message: Error = {
      message: "Server error",
    };
    res.status(500).json(message);
  }
});

/* Return file content from endpoint GET /api/files/:filename */
filesRouter.get("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const tempSplit = filename.split(".");
    const extension = tempSplit[tempSplit.length - 1];

    const files = await fsPromises.readdir(DATA_FOLDER);
    if (files.indexOf(filename) !== -1) {
      const content = await fsPromises.readFile(`${DATA_FOLDER}/${filename}`);
      const fileStat = await fsPromises.stat(`${DATA_FOLDER}/${filename}`);
      const message: RetrievedFileData = {
        message: "Success",
        filename,
        content: content.toString(),
        extension,
        uploadedDate: new Date(fileStat.birthtime).toISOString(),
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

/* Update file content from endpoint PATCH /api/files/:filename */
filesRouter.patch("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const { content } = req.body;
    if (!content) {
      const message: Error = {
        message: "Please specify 'content' parameter",
      };
      res.status(400).json(message);
      return;
    }
    const files = await fsPromises.readdir(DATA_FOLDER);
    if (files.indexOf(filename) !== -1) {
      await fsPromises.writeFile(`${DATA_FOLDER}/${filename}`, content);
      const message: CreateFileSuccess = {
        message: `File '${filename}' has been updated successfully`,
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

/* Delete file from endpoint DELETE /api/files/:filename */
filesRouter.delete("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const files = await fsPromises.readdir(DATA_FOLDER);
    if (files.indexOf(filename) !== -1) {
      await fsPromises.unlink(`${DATA_FOLDER}/${filename}`);
      const message: Message = {
        message: `File '${filename}' has been deleted`,
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
  // Init PASSWORD_FILE if it was not exist
  if (!fs.existsSync(PASSWORD_FILE)) {
    fs.writeFileSync(PASSWORD_FILE, JSON.stringify([]));
  }
  next();
}

export default filesRouter;
