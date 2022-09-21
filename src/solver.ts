import { readFileSync, promises as fsPromises } from "fs";
import lodash from "lodash"

const syncReadFile = (filename: any) => {
  const contents = readFileSync(filename, "utf-8");
  const arr = contents.split(/\r?\n/);
  return arr;
};

const words = syncReadFile("src/words.txt");

/* ---------------------- Correct Filter ---------------------- */
const filterCorrect = (correct: string[]) => {
  const results = words
    .map((word: string) => {
      const regexCorrect = new RegExp(
        correct.map((i) => (i === "" ? "." : i)).join("")
      );
      if (word.match(regexCorrect)) return word;
    })
    .filter((x) => typeof x === "string");
  return results;
};

/* ---------------------- Present Filter ---------------------- */
const filterPresent = (
  filterCorrect: string[],
  correct: string[],
  present: string[]
) => {
  const results: string[] = filterCorrect
    .map((word: any) => {
      if (present.join("").length === 0) return word;
      if (present.every((item: string) => word.includes(item))) return word;
    })
    .filter((x) => typeof x === "string");
  return results;
};

/* ---------------------- Exclusion Filter ---------------------- */
const filterExclude = (
  filterPresent: string[],
  exclude: string[],
  present: string[],
  correct: string[]
) => {
  const results: string[] = filterPresent
    .map((word: any) => {
      if (exclude.join("").length === 0) return word;
      const dedupe = exclude.filter(
        x => ![...present, ...correct].includes(x)
      );
      const regexExclude = new RegExp(`[${dedupe.join("")}]`);
      if (!word.match(regexExclude)) return word;
    })
    .filter((x) => typeof x === "string")
    .sort();
  return results;
};

export const solver = async (correct: string[], present: string[], exclude: string[], guess: string[]) => {
  const resultsCorrect: any[] = await filterCorrect!(correct);
  const resultsPresent: any[] = await filterPresent(resultsCorrect, correct, present);
  const resultsExclude: any[] = await filterExclude(
    resultsPresent,
    exclude,
    present,
    correct
  );
  const resultGuess: any[] = resultsExclude.filter(word => !guess.includes(word))
  return resultGuess;
};


