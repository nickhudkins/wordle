import type {
  CheckWordConfig,
  CheckWordInput,
  CheckWordResponse,
  LetterState,
} from "./types";

import type { EnvironmentLike } from ".././types";
import { prepareConfig, normalizeInput } from "../utils";
import {
  ConfigurationError,
  ValidationError,
  ExpiredGameError,
} from "./errors";
import { FULL_WORD_LIST } from "@nickhudkins/word-list";

const configIsValid = (config: CheckWordConfig) => {
  const { bannedWord, correctWord, rowLength } = config;
  return (
    // Words dont match configured length
    [correctWord, bannedWord].every((_) => _?.length === rowLength) &&
    // Impossible to win
    correctWord !== bannedWord
  );
};

export function createCheckHandler(config: EnvironmentLike) {
  const preparedConfig = prepareConfig(
    config instanceof Function ? config() : config
  );
  if (!configIsValid(preparedConfig)) {
    throw new ConfigurationError();
  }
  const {
    correctWord,
    bannedWord,
    rowLength,
    revision: currentRevision,
  } = preparedConfig;

  function wordIsValid(word: string) {
    if (word === bannedWord || word.length !== rowLength) {
      return false;
    }
    // We add the CORRECT_WORD such that the WORD_LIST
    // musn't contain the CORRECT_WORD, for funsies.
    return FULL_WORD_LIST.includes(word) || correctWord === word;
  }

  return function handleCheckWord({
    revision,
    maybeWord,
  }: CheckWordInput): CheckWordResponse {
    if (currentRevision !== revision) {
      throw new ExpiredGameError();
    }

    const inputWord = normalizeInput(maybeWord);
    if (!wordIsValid(inputWord)) {
      throw new ValidationError("INVALID_WORD");
    }
    return {
      letterState: getLetterState(correctWord, inputWord),
    };
  };
}

const FOUND = 2;
const EXISTS = 1;
const NOT_FOUND = 0;

export function getLetterState(
  correctWord: string,
  guessWord: string
): LetterState[] {
  if (correctWord === guessWord) {
    return new Array(correctWord.length).fill(FOUND);
  }

  const letterState = new Array(correctWord.length).fill(NOT_FOUND);

  const correctLetters = [...correctWord];
  const guessLetters = [...guessWord];

  const ocurrences = correctLetters.reduce((acc, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Correct Letter Pass
  for (const [i, guessedLetter] of guessLetters.entries()) {
    const correctLetter = correctLetters[i];
    if (guessedLetter === correctLetter) {
      letterState[i] = FOUND;

      // Decrement occurences.
      ocurrences[guessedLetter] -= 1;
    }
  }

  for (const [i, guessedLetter] of guessLetters.entries()) {
    // Don't ever replace a found letter.
    if (letterState[i] === FOUND) {
      continue;
    }

    const existsInWord = correctLetters.includes(guessedLetter);
    const hasOcurrences = ocurrences[guessedLetter] > 0;

    if (existsInWord && hasOcurrences) {
      letterState[i] = EXISTS;
      ocurrences[guessedLetter] -= 1;
    }
  }

  return letterState;
}
