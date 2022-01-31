import type { ServerResponse } from "http";
import { ROW_COUNT, ROW_LENGTH, DEFAULT_HEADERS } from "../config";

export function handleMeta(res: ServerResponse) {
  const body = JSON.stringify({
    numRows: ROW_COUNT,
    rowLength: ROW_LENGTH,
  });
  return res.writeHead(200, DEFAULT_HEADERS).end(body);
}
