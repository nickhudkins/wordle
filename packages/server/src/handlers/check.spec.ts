import { createCheckHandler } from "./check";

test("createCheckHandler: Empty Config", () => {
  const factory = () =>
    createCheckHandler(() => ({
      BANNED_WORD: "",
      CORRECT_WORD: "A",
      ROW_LENGTH: "5",
      ROW_COUNT: "100",
    }));
  expect(factory).toThrow();
});

test("createCheckHandler: Invalid Config (Impossible: Length)", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "TOO_LONG",
      CORRECT_WORD: "DIFFERENT_LENGTH",
      ROW_LENGTH: "5",
    });
  expect(factory).toThrow();
});

test("createCheckHandler: Invalid Config (Impossible: Same)", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "SAME",
      CORRECT_WORD: "SAME",
      ROW_LENGTH: "4",
    });
  expect(factory).toThrow();
});

test("createCheckHandler: Valid Config", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "AAAA",
      CORRECT_WORD: "BBBB",
      ROW_LENGTH: "4",
    });
  expect(factory).not.toThrow();
});
