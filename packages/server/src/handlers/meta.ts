import { ROW_COUNT, ROW_LENGTH } from "../config";

export function handleMeta() {
  return {
    numRows: ROW_COUNT,
    rowLength: ROW_LENGTH,
  };
}
