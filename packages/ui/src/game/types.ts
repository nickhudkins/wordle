import type { Dispatch } from "react";

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
    | "CONFIRM_ROW/COMPLETE";
  payload: any;
};

export type GameDispatch = Dispatch<ActionType>;

export type ReducerState = {
  appReady: boolean;
  loading: boolean;
  error: boolean;
  confirmedRows: ConfirmedRow[];
  placeholderRows: string[][];
  numRows?: number;
  rowLength?: number;
  gameOutcome?: GameOutcome;
};

export type GameContext = {
  state: ReducerState;
  dispatch: React.Dispatch<ActionType>;
};
