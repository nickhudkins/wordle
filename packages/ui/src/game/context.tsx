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

const INITIAL_STATE: ReducerState = {
  appReady: false,
  confirmedRows: [],
  usedLetters: {},
  placeholderRows: [],
  loading: true,
  revision: 1,
  hasInteracted: false,
};

const getGameOutcome = (
  confirmedRows: ReducerState["confirmedRows"]
): GameOutcome => {
  const isWinner = confirmedRows.some((row) =>
    row.every(({ letterState }) => letterState === 2)
  );
  const noRemaningAttempts = confirmedRows.length === 6;
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
      const gameOutcome = getGameOutcome(confirmedRows);

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
