import { normalizeInput } from "./utils";

export interface Config {
  CORRECT_WORD: string;
  BANNED_WORD: string;
  ROW_LENGTH: number;
  ROW_COUNT: number;
}

export function configFromEnv(): Config {
  const CORRECT_WORD = normalizeInput(process.env.CORRECT_WORD || "RIGHT");
  const BANNED_WORD = normalizeInput(process.env.BANNED_WORD || "WRONG");
  const ROW_LENGTH = CORRECT_WORD.length;
  const ROW_COUNT = 6;
  return {
    CORRECT_WORD,
    BANNED_WORD,
    ROW_LENGTH,
    ROW_COUNT,
  };
}

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};
