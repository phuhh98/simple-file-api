import express from "express";
import chalk from "chalk";

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  res.status(200).json({ status: "okay" }).end();
});

app.listen(PORT, () => {
  console.log(
    `\nExpress server has started at port ${chalk.bold.italic.yellow(PORT)}`
  );
});
