import { APIGatewayProxyEventHeaders } from "aws-lambda";
import * as http from "http";
process.env.CORRECT_WORD = "HELLO";
process.env.BANNED_WORD = "WRONG";
import { handler } from "./index";

const server = http.createServer(async (req: http.IncomingMessage, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "GET") {
    let routeKey = `${req.method} ${req.url}`;
    const pathParameters: Record<string, string> = {};
    const match = req.url?.match(/^\/check\/(\w+)$/);
    if (match && match[1]) {
      routeKey = `GET /check/{word}`;
      pathParameters.word = match[1];
    }
    const resp = await handler({
      routeKey,
      pathParameters,
      headers: req.headers as APIGatewayProxyEventHeaders,
    });
    res.writeHead(resp.statusCode!, {
      ...(resp.headers as http.OutgoingHttpHeaders),
      "Allow-Control-Access-Origin": "*",
    });
    return res.end(resp.body);
  }
  return res.writeHead(200).end();
});

server.listen(8080, () => console.log("🚀 Listening..."));
