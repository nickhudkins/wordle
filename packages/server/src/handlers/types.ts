import type { Config } from "../types";

type FOUND = 2;
type EXISTS = 1;
type NOT_FOUND = 0;

export type LetterState = FOUND | EXISTS | NOT_FOUND;

export type CheckWordConfig = Pick<
  Config,
  "bannedWord" | "correctWord" | "rowLength"
>;

export interface CheckWordInput {
  revision: number;
  maybeWord: string;
}

export type CheckWordResponse = {
  letterState: LetterState[];
};

export type MetaConfig = Pick<Config, "rowLength" | "numRows" | "revision">;

export type MetaResponse = {
  numRows: number;
  rowLength: number;
  revision: number;
};
