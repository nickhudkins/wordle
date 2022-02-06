import { handler } from "../index";

jest.mock(
  "../utils",
  () => ({
    normalizeInput: (s: string) => s.toUpperCase(),
    prepareConfig: () => ({
      correctWord: "ABCDE",
      bannedWord: "WRONG",
      numRows: 16,
      rowLength: 5,
      revision: 1,
    }),
  }),
  {}
);

test("handler: GET /check/{word} - WRONG", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    headers: {
      "x-nordle-revision": "1",
    },
    pathParameters: {
      word: "WRONG",
    },
  });
  expect(checkResp.statusCode).toBe(400);
  expect(() => JSON.parse(checkResp.body!)).not.toThrow();
});

test("handler: GET /check/{word} - ABCDE", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    headers: {
      "x-nordle-revision": "1",
    },
    pathParameters: {
      word: "ABCDE",
    },
  });
  expect(checkResp.statusCode).toBe(200);
  expect(() => JSON.parse(checkResp.body!)).not.toThrow();
});

test("handler: GET /check/{word}", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    headers: {
      "x-nordle-revision": "1",
    },
    pathParameters: {},
  });
  expect(checkResp.statusCode).toBe(404);
});

test("handler: GET /non-existent", async () => {
  const checkResp = await handler({
    routeKey: "GET /non-existent",
    headers: {
      "x-nordle-revision": "1",
    },
  });
  expect(checkResp.statusCode).toBe(404);
});

test("handler: GET /check/{word} - Expired Game", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    pathParameters: {
      word: "hello",
    },
    headers: {
      "x-nordle-revision": "9999",
    },
  });
  expect(checkResp.statusCode).toBe(410);
});

test("handler: GET /check/{word} - Expired Game - Safe Release", async () => {
  const checkResp = await handler({
    routeKey: "GET /check/{word}",
    pathParameters: {
      word: "hello",
    },
    // Missing headers should succeed for old clients
    headers: {},
  });
  expect(checkResp.statusCode).toBe(200);
});
