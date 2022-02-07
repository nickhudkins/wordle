import { handler } from "./index";

jest.mock(
  "./utils",
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

type Payload = {
  word?: string;
  revision?: string | null;
};

const createCheckWordPayload = ({ word, revision = "1" }: Payload) => ({
  routeKey: "GET /check/{word}",
  pathParameters: {
    word,
  },
  headers: {
    ...(revision ? { "x-nordle-revision": revision } : null),
  },
});

test("handler: GET /check/{word} - WRONG", async () => {
  const payload = createCheckWordPayload({
    word: "WRONG",
  });
  const checkResp = await handler(payload);
  expect(checkResp.statusCode).toBe(400);
  expect(() => JSON.parse(checkResp.body!)).not.toThrow();
});

test("handler: GET /check/{word} - ABCDE", async () => {
  const payload = createCheckWordPayload({
    word: "ABCDE",
  });
  const checkResp = await handler(payload);
  expect(checkResp.statusCode).toBe(200);
  expect(() => JSON.parse(checkResp.body!)).not.toThrow();
});

test("handler: GET /check/{word}", async () => {
  const payload = createCheckWordPayload({
    word: undefined,
  });
  const checkResp = await handler(payload);
  expect(checkResp.statusCode).toBe(404);
});

test("handler: GET /check/{word} - Expired Game - Safe Release", async () => {
  const payload = createCheckWordPayload({
    word: "ABCDE",
    revision: null,
  });
  const checkResp = await handler(payload);
  expect(checkResp.statusCode).toBe(200);
});

test("handler: GET /check/{word} - Expired Game", async () => {
  const payload = createCheckWordPayload({
    word: "ABCDE",
    revision: "-1",
  });
  const checkResp = await handler(payload);
  expect(checkResp.statusCode).toBe(410);
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
