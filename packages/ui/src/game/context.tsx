import * as React from "react";
import { createContext, useReducer, useEffect } from "react";
import type {
  ReducerState,
  GameOutcome,
  GameContext,
  ActionType,
} from "./types";

const INITIAL_STATE: ReducerState = {
  appReady: false,
  confirmedRows: [],
  error: false,
  placeholderRows: [],
  loading: true,
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

function reducer(state: ReducerState, action: ActionType) {
  const { type, payload } = action;
  const { placeholderRows, numRows } = state;
  switch (type) {
    case "CONFIRM_ROW/START":
      return {
        ...state,
        loading: true,
      };
    case "CONFIRM_ROW/REJECT": {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }
    case "CONFIRM_ROW/COMPLETE":
      const confirmedRows = [...state.confirmedRows, action.payload];
      const gameOutcome = getGameOutcome(confirmedRows);
      const currentRowOffset = gameOutcome ? 0 : -1;
      const attemptsRemaining =
        numRows - confirmedRows.length + currentRowOffset;
      const newPlaceholderRows = placeholderRows.slice(
        0,
        Math.max(attemptsRemaining, 0)
      );
      return {
        ...state,
        confirmedRows,
        error: false,
        loading: false,
        placeholderRows: newPlaceholderRows,
        gameOutcome: gameOutcome,
      };
    case "META/COMPLETE":
      const { numRows: metaNumRows, rowLength } = payload;
      return {
        ...state,
        appReady: true,
        numRows: metaNumRows,
        rowLength,
        placeholderRows: new Array(metaNumRows - 1).fill(
          new Array(rowLength).fill("")
        ),
        loading: false,
      };
    case "META/REJECT":
      return {
        ...state,
        error: true,
      };
    default:
      break;
  }
  return state;
}

const INITIAL_CONTEXT: GameContext = {
  state: INITIAL_STATE,
  dispatch: () => {},
};

export const Context = createContext(INITIAL_CONTEXT);

export const GameContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  useEffect(() => {
    fetch("/api/meta")
      .then((resp) => resp.json())
      .then((payload) => {
        dispatch({
          type: "META/COMPLETE",
          payload,
        });
      });
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
