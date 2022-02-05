import { ROW_LENGTH, CORRECT_WORD, BANNED_WORD } from "../config";
import WORD_LIST from "./word-list.json";
import EXTRA_WORDS from "./additional-words.json";

const normalizeInput = (str: string) => str.trim().toLowerCase();
const FULL_WORD_LIST = [...WORD_LIST, ...EXTRA_WORDS].map(normalizeInput);
const NORMALIZED_CORRECT_WORD = normalizeInput(CORRECT_WORD);

function wordIsValid(word: string) {
  const normalized = normalizeInput(word);
  if (normalized === BANNED_WORD) {
    return false;
  }
  return FULL_WORD_LIST.includes(word);
}

interface CheckHandlerArgs {
  maybeWord: string;
}

export function handleCheckWord({ maybeWord }: CheckHandlerArgs) {
  const inputWord = normalizeInput(maybeWord);
  if (!wordIsValid(inputWord)) {
    throw new Error("INVALID_WORD");
  }
  const letters = inputWord.slice(0, ROW_LENGTH).split("");
  const letterState = letters.map((l, i) => {
    const index = NORMALIZED_CORRECT_WORD.indexOf(l);
    const exists = index >= 0;
    const correctLocation = exists ? NORMALIZED_CORRECT_WORD[i] === l : false;
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
}
