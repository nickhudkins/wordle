import type { Config, EnvironmentObject } from "./types";
export const normalizeInput = (str: string) => str.trim().toLowerCase();

export function prepareConfig({
  CORRECT_WORD,
  BANNED_WORD,
  ROW_COUNT = "6",
  ROW_LENGTH = "5",
  REVISION = "1",
}: EnvironmentObject): Config {
  const correctWord = normalizeInput(CORRECT_WORD || "");
  const bannedWord = normalizeInput(BANNED_WORD || "");
  const rowLength = correctWord.length || parseInt(ROW_LENGTH, 10);
  return {
    correctWord,
    bannedWord,
    rowLength,
    numRows: parseInt(ROW_COUNT, 10),
    revision: parseInt(REVISION, 10),
  };
}
