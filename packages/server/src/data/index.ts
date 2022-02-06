import WORD_LIST from "./word-list.json";
import EXTRA_WORDS from "./additional-words.json";
import { normalizeInput } from "../utils";

export const FULL_WORD_LIST = [...WORD_LIST, ...EXTRA_WORDS].map(
  normalizeInput
);
