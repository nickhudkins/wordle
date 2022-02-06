import type {
  APIGatewayEventProps,
  APIGatewayProxyStructuredResultV2,
} from "./types";
import { ok, errorResponse, notFound } from "./http";
import { createCheckHandler, createMetaHandler } from "./handlers";

let checkWordHandler: ReturnType<typeof createCheckHandler>;
let metaHandler: ReturnType<typeof createMetaHandler>;

export const handler = async (
  event: APIGatewayEventProps
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    switch (event.routeKey) {
      case "GET /meta":
        if (!metaHandler) {
          metaHandler = createMetaHandler(() => process.env);
        }
        const metaResp = metaHandler();
        return ok(metaResp);
      case "GET /check/{word}":
        if (!checkWordHandler) {
          checkWordHandler = createCheckHandler(() => process.env);
        }
        const maybeWord = event?.pathParameters?.["word"]!;
        const revision = parseInt(
          event?.headers?.["x-nordle-revision"] || "1",
          10
        );
        if (maybeWord) {
          const checkWordResp = checkWordHandler({ maybeWord, revision });
          return ok(checkWordResp);
        }
    }
    return notFound();
  } catch (e) {
    return errorResponse(e as Error);
  }
};
