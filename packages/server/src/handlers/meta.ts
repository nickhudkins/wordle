import type { MetaResponse } from "./types";
import type { EnvironmentLike } from "../types";
import { prepareConfig } from "../utils";

export function createMetaHandler(config: EnvironmentLike) {
  return function handleMeta(): MetaResponse {
    const { numRows, rowLength, revision } = prepareConfig(
      config instanceof Function ? config() : config
    );
    return {
      revision,
      numRows,
      rowLength,
    };
  };
}
