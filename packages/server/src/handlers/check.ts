import { ROW_LENGTH, CORRECT_WORD, BANNED_WORD } from "../config";
import WORD_LIST from "./word-list.json";
import EXTRA_WORDS from "./additional-words.json";

const FULL_WORD_LIST = [...WORD_LIST, ...EXTRA_WORDS];

function wordIsValid(word: string) {
  const normalized = word.toLowerCase();
  if (normalized === BANNED_WORD) {
    return false;
  }
  return FULL_WORD_LIST.includes(word);
}

interface CheckHandlerArgs {
  maybeWord: string;
}

export function handleCheckWord({ maybeWord }: CheckHandlerArgs) {
  if (!wordIsValid(maybeWord)) {
    throw new Error("INVALID_WORD");
  }
  const letters = maybeWord.toUpperCase().slice(0, ROW_LENGTH).split("");
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
}
