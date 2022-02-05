import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { configFromEnv } from "./config";
import { createCheckHandler, createMetaHandler } from "./handlers";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const config = configFromEnv();
const checkWordHandler = createCheckHandler(config);
const metaHandler = createMetaHandler(config);

type UsedEventProps = Pick<
  APIGatewayProxyEventV2,
  "routeKey" | "pathParameters"
>;

export const handler = async (
  event: UsedEventProps
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    switch (event.routeKey) {
      case "GET /meta":
        return {
          headers: defaultHeaders,
          statusCode: 200,
          body: JSON.stringify(metaHandler()),
        };
      case "GET /check/{word}":
        const { pathParameters } = event;
        // We know we'll have it
        const maybeWord = pathParameters!["word"]!;
        return {
          headers: defaultHeaders,
          statusCode: 200,
          body: JSON.stringify(checkWordHandler({ maybeWord })),
        };
    }
    return { statusCode: 400, headers: defaultHeaders };
  } catch (e) {
    const { message } = e as Error;
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: message,
      }),
    };
  }
};
