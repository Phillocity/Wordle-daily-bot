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

app.route("/").get((req: Request, res: Response) => {
  res.render("home");
});

app.route("/result").get((req: Request, res: Response) => {
  const attempt = async () => {
    try {
      await browserLaunch.browserSolved();
      res.render("partials/success");
    } catch (err) {
      res.render("partials/error");
    }
  };
  attempt();
});

// app.route("/success")
// .get((req: Request, res: Response) => {
//     res.render("partials/success");
// })

// app.route("/error")
// .get((req: Request, res: Response) => {
//     res.render("partials/error");
// })
