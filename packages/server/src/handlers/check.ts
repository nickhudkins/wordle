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
import { FULL_WORD_LIST } from "../data";

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
const REPLACEMENT_TOKEN = "_";

export function getLetterState(correctWord: string, guessWord: string) {
  if (correctWord === guessWord) {
    return new Array(correctWord.length).fill(FOUND);
  }

  const correctLetters = [...correctWord];
  const guessLetters = [...guessWord];
  const wordLength = guessLetters.length;

  const letterState = new Array(wordLength).fill(NOT_FOUND);

  for (let i = 0; i < wordLength; i++) {
    const guessLetter = guessLetters[i];
    const correctLetter = correctLetters[i];

    if (guessLetter === correctLetter) {
      letterState[i] = FOUND;
      correctLetters[i] = REPLACEMENT_TOKEN;
    }
  }

  for (let i = 0; i < wordLength; i++) {
    if (letterState[i] === FOUND) {
      continue;
    }
    const guessLetter = guessLetters[i];
    const maybeFoundIndex = correctLetters.indexOf(guessLetter);
    if (maybeFoundIndex >= 0) {
      letterState[i] = EXISTS;
      correctLetters[i] = REPLACEMENT_TOKEN;
    }
  }

  return letterState;
}
