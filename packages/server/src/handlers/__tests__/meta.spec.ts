import { createMetaHandler } from "../meta";

test("metaHandler - JUST COUNTS", () => {
  const resp = createMetaHandler({
    ROW_LENGTH: "5",
    ROW_COUNT: "6",
  })();

  expect(resp.rowLength).toBe(5);
  expect(resp.numRows).toBe(6);
});

test("metaHandler - CORRECT_WORD", () => {
  const resp = createMetaHandler({
    CORRECT_WORD: "MORETHANTHREE",
    ROW_LENGTH: "3",
  })();

  expect(resp.rowLength).toBe(13);
  expect(resp.numRows).toBe(6);
});
