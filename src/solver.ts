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
      const regexCorrect = new RegExp(correct.map((i) => (i === "" ? "." : i)).join(""));
      if (word.match(regexCorrect)) return word;
    })
    .filter((x) => typeof x === "string");
  return results;
};

/* ----------------- Present Filter to include any word that has yellow keywords ---------------- */
const filterPresent = (filterCorrect: string[], present: string[], correct: string[]) => {
  
  const results: string[] = filterCorrect
    .map((word: any) => {
      const deDupe = present.filter((x) => {
        if (![...correct].includes(x)) return true;
      });
      if (deDupe.join("").length === 0) return word;
      if (deDupe.every((item: string) => word.includes(item))) return word;
    })
    .filter((x) => typeof x === "string");
  return results;
};

/* -------------- Exclusion Filter and removes guessed keywords from the word array ------------- */
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
      const deDupe = exclude.filter((x) => {
        if (![...present, ...correct].includes(x)) return true;
      });
      const regexExclude = new RegExp(`[${deDupe.join("")}]`);
      if (!word.match(regexExclude)) return word;
    })
    .filter((x) => typeof x === "string");
  return results.filter((word) => !guess.includes(word)).sort();
};

/* --- Further filters the list to not include any keywords where previous guesses overlapped --- */
/* -------------- So words such as "sleet" and "steal" are not included in the list ------------- */
/* ------------------------ Due to "S" and "L" being in the same index position ----------------- */

const filterDuplicateIndex = (
  filterExclude: string[],
  correct: string[],
  guess: string[]
) => {
  const finalResults = filterExclude
    .filter((word: any) => {
      const allGuessFilter = guess.every((guesses) => {
        const regexExcludeCorrect = new RegExp(`[${correct}]`, "g");
        const previousWord = guesses.replace(regexExcludeCorrect, "");
        const potentialWord = word.replace(regexExcludeCorrect, "");
        const containDuplicatePresent = [...previousWord].some(
          (item: string) => {
            return previousWord.indexOf(item) === potentialWord.indexOf(item);
          }
        );
        return !containDuplicatePresent;
      });

      return allGuessFilter;
    })
    .sort();
  return finalResults;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                         Exported solver                                        */
/* ---------------------------------------------------------------------------------------------- */
export const solver = async (
  correct: string[],
  present: string[],
  exclude: string[],
  guess: string[]
) => {
  const resultsCorrect: any[] = await filterCorrect(correct);
  const resultsPresent: any[] = await filterPresent(resultsCorrect, present, correct);
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
