import app from "./app";
import chalk from "chalk";

const PORT = 8080;

app.listen(PORT, () => {
  console.log(
    `\nExpress server has started at port ${chalk.bold.italic.yellow(PORT)}`
  );
});
