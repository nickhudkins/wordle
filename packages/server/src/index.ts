import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { configFromEnv } from "./config";
import { createCheckHandler } from "./handlers";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const config = configFromEnv();
const checkWordHandler = createCheckHandler(config);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    switch (event.routeKey) {
      case "GET /meta":
        return {
          headers: defaultHeaders,
          statusCode: 200,
          body: JSON.stringify({
            numRows: config.ROW_COUNT,
            rowLength: config.ROW_LENGTH,
          }),
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
