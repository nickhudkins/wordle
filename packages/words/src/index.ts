import WORD_LIST from "./word-list.json";
import EXTRA_WORDS from "./additional-words.json";

export const normalizeInput = (str: string) => str.trim().toLowerCase();

export const FULL_WORD_LIST: string[] = [...WORD_LIST, ...EXTRA_WORDS].map(
  normalizeInput
);
