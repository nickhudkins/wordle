import type {
  CheckWordConfig,
  CheckWordInput,
  CheckWordResponse,
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

function getLetterState(word: string, guess: string) {
  return guess.split("").map((letter, letterIndex) => {
    const exists = word.indexOf(letter) >= 0;
    const correctLocation = word[letterIndex] === letter;
    if (correctLocation) {
      return 2;
    } else if (exists) {
      return 1;
    }
    return 0;
  });
}
