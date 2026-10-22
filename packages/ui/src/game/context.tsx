const API_URL = import.meta.env.VITE_API_URL;

import * as React from "react";
import { createContext, useReducer, useEffect } from "react";
import type {
  ConfirmedRow,
  ReducerState,
  GameOutcome,
  GameContext,
  ActionType,
  WordleAPI,
  LetterState,
} from "./types";

const INFINITY_MODE_KEY = "nordle:infinity-mode";

const readInfinityMode = (): boolean => {
  try {
    return localStorage.getItem(INFINITY_MODE_KEY) === "true";
  } catch {
    return false;
  }
};

const saveInfinityMode = (enabled: boolean) => {
  try {
    localStorage.setItem(INFINITY_MODE_KEY, String(enabled));
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
};

const INITIAL_STATE: ReducerState = {
  appReady: false,
  confirmedRows: [],
  usedLetters: {},
  placeholderRows: [],
  loading: true,
  revision: 1,
  hasInteracted: false,
  infinityMode: readInfinityMode(),
};

const getGameOutcome = (
  confirmedRows: ReducerState["confirmedRows"],
  numRows: number = 6,
  infinityMode: boolean = false
): GameOutcome => {
  const isWinner = confirmedRows.some((row) =>
    row.every(({ letterState }) => letterState === 2)
  );
  // In infinity mode you simply never run out of attempts.
  const noRemaningAttempts =
    !infinityMode && confirmedRows.length >= numRows;
  if (isWinner) {
    return "WINNER";
  } else if (noRemaningAttempts) {
    return "NOT_WINNER";
  }
  return;
};

const emptyKeyboardUsage: Record<string, LetterState> = {};

const getKeyUsage = (
  confirmedRows: ConfirmedRow[]
): Record<string, LetterState> =>
  confirmedRows.flat().reduce(
    (usage, { value: letter, letterState }) => ({
      ...usage,
      [letter]: Math.max(
        usage[letter] || -Infinity,
        letterState
      ) as LetterState,
    }),
    emptyKeyboardUsage
  );

function reducer(state: ReducerState, action: ActionType) {
  const { type, payload } = action;
  switch (type) {
    case "INTERACTION/OCCURRED":
      return state.hasInteracted
        ? state
        : {
            ...state,
            hasInteracted: true,
          };

    case "CONFIRM_ROW/START":
      return {
        ...state,
        loading: true,
      };
    case "CONFIRM_ROW/REJECT":
      return {
        ...state,
        error: payload.reason,
        loading: false,
      };
    case "CONFIRM_ROW/COMPLETE":
      const confirmedRows: ConfirmedRow[] = [
        ...state.confirmedRows,
        action.payload,
      ];
      const gameOutcome = getGameOutcome(
        confirmedRows,
        state.numRows,
        state.infinityMode
      );

      // Ensures that when "<CurrentRow />" disappears,
      // we accurately pad the board
      const currentRowOffset = gameOutcome ? 0 : -1;
      const attemptsRemaining =
        state.numRows - confirmedRows.length + currentRowOffset;

      const newPlaceholderRows = state.placeholderRows.slice(
        0,
        Math.max(attemptsRemaining, 0)
      );
      return {
        ...state,
        confirmedRows,
        error: undefined,
        loading: false,
        usedLetters: getKeyUsage(confirmedRows),
        placeholderRows: newPlaceholderRows,
        gameOutcome: gameOutcome,
      };
    case "INFINITY_MODE/TOGGLE": {
      // Once the game is over, the mode is locked in.
      if (state.gameOutcome) return state;
      const infinityMode = !state.infinityMode;
      // Turning it off after row 6 ends the game immediately. Consequences.
      const gameOutcome = getGameOutcome(
        state.confirmedRows,
        state.numRows,
        infinityMode
      );
      const attemptsRemaining =
        (state.numRows ?? 0) -
        state.confirmedRows.length +
        (gameOutcome ? 0 : -1);
      const placeholderRows = new Array(Math.max(attemptsRemaining, 0)).fill(
        new Array(state.rowLength ?? 0).fill("")
      );
      return {
        ...state,
        infinityMode,
        gameOutcome,
        placeholderRows,
      };
    }
    case "META/COMPLETE":
      const { numRows, rowLength, revision } = payload;
      const placeholderRows = new Array(numRows - 1).fill(
        new Array(rowLength).fill("")
      );
      return {
        ...state,
        revision,
        appReady: true,
        loading: false,
        numRows,
        rowLength,
        placeholderRows,
      };
    case "META/REJECT":
      return {
        ...state,
        loading: false,
        error: payload.reason,
      };
    default:
      break;
  }
  return state;
}

const INITIAL_CONTEXT: GameContext = {
  state: INITIAL_STATE,
  dispatch: () => {},
  wordleAPI: (() => Promise.resolve()) as WordleAPI,
};
export const Context = createContext(INITIAL_CONTEXT);
export const GameContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const wordleAPI: WordleAPI = (apiPath: RequestInfo, opts?: RequestInit) => {
    return fetch(`${API_URL}${apiPath}`, {
      ...opts,
      headers: {
        "cache-control": "no-cache",
        "x-nordle-revision": `${state.revision}`,
      },
    }).then(async (resp) => ({
      ...(await resp.json()),
      status: resp.status,
    }));
  };

  useEffect(() => {
    saveInfinityMode(state.infinityMode);
  }, [state.infinityMode]);

  useEffect(() => {
    wordleAPI(`/meta`)
      .then((payload) => {
        dispatch({
          type: "META/COMPLETE",
          payload,
        });
      })
      .catch((e) => dispatch({ type: "META/REJECT", payload: { reason: e } }));
  }, []);

  return (
    <Context.Provider value={{ state, dispatch, wordleAPI }}>
      {children}
    </Context.Provider>
  );
};
