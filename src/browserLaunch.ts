import * as solver from "./solver.js";
import lodash from "lodash";
import { performance, PerformanceObserver } from "perf_hooks";
import puppeteer from "puppeteer";


export const browserSolved = async () => {
const delay = async (time: number) => {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  };
  
  const wordleSolve = async () => {
    let part1 = Math.round(performance.now() / 1000);
    console.log(`1. Launched Browser`);
  
    /* ---------------------------------------------------------------------------------------------- */
    /*                                      Launches the browser                                      */
    /* ---------------------------------------------------------------------------------------------- */
    const browser = await puppeteer.launch({
      // executablePath: '/snap/bin/chromium',
      // executablePath: "/usr/bin/google-chrome-stable",
      headless: true
    });
  
    let part2 = Math.round(performance.now() / 1000 - part1);
    console.log(`2. Waiting for New Tab`);
    const page = await browser.newPage();
  
    let part3 = Math.round(performance.now() / 1000 - part2);
    console.log(`3. Navigate to Page`);
    await page.goto("https://www.nytimes.com/games/wordle/index.html", {
      waitUntil: "domcontentloaded",
    });
    //@ts-ignore
    await page._client.send("Animation.setPlaybackRate", { playbackRate: 2 });
  
    /* ---------------------------------------------------------------------------------------------- */
    /*                                 Close cookie and accept prompt                                 */
    /* ---------------------------------------------------------------------------------------------- */
  
    await page.waitForSelector("#pz-gdpr-btn-accept");
    await page.click("#pz-gdpr-btn-accept");
    await page.waitForSelector(".Modal-module_closeIcon__b4z74");
    await page.click(".Modal-module_closeIcon__b4z74");
    await page.waitForSelector(".Row-module_row__dEHfN");
    await page.evaluate(() => {
      //@ts-ignore
      document.querySelector("div").remove();
    });
  
    /* -------------------------------------- Typing best starter word -------------------------------------- */
    const typer = async (word: string) => {
      await page.keyboard.type(word);
      await page.keyboard.press("Enter");
      await delay(3000);
    };
  
    await typer("salet");
  
    let correct: string[] = ["", "", "", "", ""];
    let present: string[] = [];
    let exclude: string[] = [];
    let guess: string[] = ["salet"];
  
    await page.exposeFunction("solver", solver.solver);
  
    for (let rowNumber = 0; rowNumber <= 25; rowNumber += 5) {
      const row: any = await page.evaluate(
        (rowNumber, correct, present, exclude, guess) => {
          /* -------------------- Get all letter tiles from each row and turn to array -------------------- */
          const letterTiles = Array.from(
            document.querySelectorAll(".Tile-module_tile__3ayIZ")
          ).splice(0 + rowNumber, rowNumber + 5);
  
          letterTiles.forEach((letter, index) => {
            // Get the letter from each tile
            if ((letter as HTMLElement).dataset.state === "correct") {
              correct[index] = letter.textContent!.trim();
            } else if ((letter as HTMLElement).dataset.state === "present") {
              present.push(letter.textContent!);
            } else if ((letter as HTMLElement).dataset.state === "absent")
              exclude.push(letter.textContent!);
          });
  
          return { correct, present, exclude, guess };
        },
        rowNumber,
        correct,
        present,
        exclude,
        guess
      );
  
      /* ---------------------------- Update values from browser evaluation --------------------------- */
      correct = row.correct || [];
      present = row.present || [];
      exclude = row.exclude || [];
  
      if (lodash.without(correct, "").length === 5) break;
      const solverKeywords = await solver.solver(
        correct,
        present,
        exclude,
        guess
      );
  
      // @ts-ignore
      const sortedKeywords = solverKeywords.sort((a: string, b: string) => {
        if (new Set(a).size > new Set(b).size) return -1;
      });
      const nextWord = lodash.sample(sortedKeywords);
      guess.push(nextWord);
      await typer(nextWord);
    }
  
    /* --------------- Closes the stats modal when successful then takes a screenshot --------------- */
    await page.waitForSelector(".Modal-module_closeIcon__b4z74");
    page.click(".Modal-module_closeIcon__b4z74");
    await page.waitForSelector(".Modal-module_closeIcon__b4z74", {
      hidden: true,
    });
    let part4 = Math.round(performance.now() / 1000);
    console.log(`4. Screenshot`);
    console.log(`---------------------`);
    await page.bringToFront()
    await page.screenshot({ path: "results.png" });
    await browser.close();
  }
   await wordleSolve();
}

