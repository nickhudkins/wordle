import type { Dispatch } from "react";

type FOUND = 2;
type EXISTS = 1;
type NOT_FOUND = 0;

export type LetterState = FOUND | EXISTS | NOT_FOUND;

export type GameOutcome = "WINNER" | "NOT_WINNER";

export type ConfirmedRow = {
  value: string;
  letterState?: number;
}[];

export type ActionType = {
  type:
    | "META/REJECT"
    | "META/COMPLETE"
    | "CONFIRM_ROW/START"
    | "CONFIRM_ROW/REJECT"
    | "CONFIRM_ROW/COMPLETE"
    | "INTERACTION/OCCURRED";
  payload: any;
};

export type GameDispatch = Dispatch<ActionType>;

export type ReducerState = {
  // General App State
  appReady: boolean;
  loading: boolean;
  hasInteracted: boolean;
  error?: Error;
  gameOutcome?: GameOutcome;

  // Specific "Board State"
  usedLetters: Record<string, LetterState>;
  confirmedRows: ConfirmedRow[];
  placeholderRows: string[][];

  // App "Meta"
  numRows?: number;
  rowLength?: number;
  revision: number;
};

type FetchArgs = Parameters<typeof fetch>;
export type WordleAPI = (...args: FetchArgs) => Promise<any>;

export type GameContext = {
  state: ReducerState;
  wordleAPI?: WordleAPI;
  dispatch: React.Dispatch<ActionType>;
};
