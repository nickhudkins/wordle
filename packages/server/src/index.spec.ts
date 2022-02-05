import { handler } from "./index";

test("handler: GET /meta", async () => {
  const metaResp = await handler({
    routeKey: "GET /meta",
  });
  expect(metaResp.statusCode).toBe(200);
  expect(() => JSON.parse(metaResp.body!)).not.toThrow();
});

test("handler: GET /check/{word}", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    pathParameters: {
      word: "RIGHT",
    },
  });
  expect(checkResp.statusCode).toBe(200);
  expect(() => JSON.parse(checkResp.body!)).not.toThrow();
});

test("handler: GET /check/{word}", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    pathParameters: {},
  });
  expect(checkResp.statusCode).toBe(400);
});

test("handler: GET /nope", async () => {
  const checkResp = await handler({
    routeKey: "GET /non-existent",
  });
  expect(checkResp.statusCode).toBe(400);
});
