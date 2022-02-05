import type { Config } from "../config";

export type MetaResp = {
  numRows: number;
  rowLength: number;
};

type CheckConfig = Pick<Config, "ROW_LENGTH" | "ROW_COUNT">;

export function createMetaHandler(config: CheckConfig) {
  return function handleMeta(): MetaResp {
    return {
      numRows: config.ROW_COUNT,
      rowLength: config.ROW_LENGTH,
    };
  };
}
