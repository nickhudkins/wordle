import type { Config } from "../config";
import WORD_LIST from "./word-list.json";
import EXTRA_WORDS from "./additional-words.json";
import { normalizeInput } from "../utils";
const FULL_WORD_LIST = [...WORD_LIST, ...EXTRA_WORDS].map(normalizeInput);

interface CheckHandlerArgs {
  maybeWord: string;
}
export class ValidationError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "ValidationError";
  }
}

type CheckConfig = Pick<Config, "BANNED_WORD" | "CORRECT_WORD" | "ROW_LENGTH">;

const configIsValid = (config: CheckConfig) => {
  const { BANNED_WORD, CORRECT_WORD, ROW_LENGTH } = config;
  return (
    // Words dont match configured length
    [CORRECT_WORD, BANNED_WORD].every((_) => _?.length === ROW_LENGTH) &&
    // Impossible to win
    CORRECT_WORD !== BANNED_WORD
  );
};

export function createCheckHandler(config: CheckConfig) {
  if (!configIsValid(config)) {
    throw new Error("INVALID_CONFIG");
  }
  const BANNED_WORD = normalizeInput(config.BANNED_WORD);
  const CORRECT_WORD = normalizeInput(config.CORRECT_WORD);

  function wordIsValid(word: string) {
    const normalized = normalizeInput(word);
    if (normalized === BANNED_WORD) {
      return false;
    }
    // We add the CORRECT_WORD such that the WORD_LIST
    // musn't contain the CORRECT_WORD, for funsies.
    return [...FULL_WORD_LIST, CORRECT_WORD].includes(word);
  }
  return function handleCheckWord({ maybeWord }: CheckHandlerArgs) {
    const inputWord = normalizeInput(maybeWord);
    if (!wordIsValid(inputWord)) {
      throw new ValidationError("INVALID_WORD");
    }
    const letters = inputWord.slice(0, config.ROW_LENGTH).split("");
    const letterState = letters.map((l, i) => {
      const index = CORRECT_WORD.indexOf(l);
      const exists = index >= 0;
      const correctLocation = exists ? CORRECT_WORD[i] === l : false;
      if (exists && correctLocation) {
        return 2;
      } else if (exists) {
        return 1;
      }
      return 0;
    });

    return {
      letterState,
    };
  };
}
