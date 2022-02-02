export const CORRECT_WORD = process.env.CORRECT_WORD || "LIGHT";
export const BANNED_WORD = process.env.BANNED_WORD || "WRONG";

export const ROW_LENGTH = CORRECT_WORD.length;
export const ROW_COUNT = 6;

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};
