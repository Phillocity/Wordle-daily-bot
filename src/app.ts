import express, { Request, Response } from "express";
import dotenv from "dotenv";
import * as browserLaunch from "./browserLaunch.js";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.listen(port);
app.use(express.static("dist"));
app.use("/static", express.static("."));
app.use("/js", express.static("dist/scripts"));
app.set("view engine", "ejs");

app.route("/")
.get((req: Request, res: Response) => {
  res.render("home");
})
.post((req: Request, res: Response) => {
  const attempt = async () => {
    try {
      await browserLaunch.browserSolved();
      res.send("Success");
    } catch (err) {
      res.status(500).send(err);
    }
  };
  attempt();
});
