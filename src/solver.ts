import { readFileSync, promises as fsPromises } from "fs";

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
const filterPresent = (filterCorrect: string[], present: string[]) => {
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
  correct: string[],
  guess: string[]
) => {
  const results: string[] = filterPresent
    .map((word: any) => {
      if (exclude.join("").length === 0) return word;
      const deDupe = exclude.filter(
        (x) => ![...present, ...correct].includes(x)
      );
      const regexExclude = new RegExp(`[${deDupe.join("")}]`);
      if (!word.match(regexExclude)) return word;
    })
    .filter((x) => typeof x === "string");
  return results.filter((word) => !guess.includes(word)).sort();
};

const filterDuplicateIndex = (
  filterExclude: string[],
  correct: string[],
  guess: string[]
) => {
  const finalResults = filterExclude
    .filter((word: any) => {
      const regexExcludeCorrect = new RegExp(`[${correct}]`, "g");
      const previousWord = guess
        .slice(-1)
        .join("")
        .replace(regexExcludeCorrect, "");
      const potentialWord = word.replace(regexExcludeCorrect, "");
      const containDuplicatePresent = [...previousWord].some((item: string) => {
        if (previousWord.indexOf(item) === potentialWord.indexOf(item))
          return true;
      });
      return !containDuplicatePresent;
    })
    .sort();
  return finalResults;
};

export const solver = async (
  correct: string[],
  present: string[],
  exclude: string[],
  guess: string[]
) => {
  const resultsCorrect: any[] = await filterCorrect(correct);
  const resultsPresent: any[] = await filterPresent(resultsCorrect, present);
  const resultsExclude: any[] = await filterExclude(
    resultsPresent,
    exclude,
    present,
    correct,
    guess
  );
  const resultsDuplicateIndex: any[] = await filterDuplicateIndex(
    resultsExclude,
    correct,
    guess
  );

  return resultsDuplicateIndex;
};
