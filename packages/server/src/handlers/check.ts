import type { ServerResponse } from "http";
import { ROW_LENGTH, DEFAULT_HEADERS, CORRECT_WORD } from "../config";

function wordIsValid(word: string) {
  const normalized = word.toUpperCase();
  if (normalized === "WRONG") {
    return false;
  }
  return true;
}

interface CheckHandlerArgs {
  maybeWord: string;
}

export function handleCheckWord(
  res: ServerResponse,
  { maybeWord }: CheckHandlerArgs
) {
  if (!wordIsValid(maybeWord)) {
    return res.writeHead(400).end();
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
  const body = JSON.stringify({
    letterState,
  });
  return res.writeHead(200, DEFAULT_HEADERS).end(body);
}
