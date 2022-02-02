import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { handleMeta, handleCheckWord } from "./handlers";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    switch (event.routeKey) {
      case "GET /meta":
        return {
          headers: defaultHeaders,
          statusCode: 200,
          body: JSON.stringify(handleMeta()),
        };
      case "GET /check/{word}":
        const { pathParameters } = event;
        // We know we'll have it
        const maybeWord = pathParameters!["word"]!;
        return {
          headers: defaultHeaders,
          statusCode: 200,
          body: JSON.stringify(handleCheckWord({ maybeWord })),
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
