import { createMetaHandler } from "./meta";

test("metaHandler", () => {
  const resp = createMetaHandler({
    ROW_COUNT: 5,
    ROW_LENGTH: 6,
  })();

  expect(resp.numRows).toBe(5);
  expect(resp.rowLength).toBe(6);
});
