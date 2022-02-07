import { ValidationError } from "../errors";
import { createCheckHandler } from "../check";

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

test("handleCheckWord: Invalid Input (Not a Word)", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: "4",
    REVISION: "1",
  });
  expect(() =>
    handleCheckWord({ maybeWord: "$$$$$", revision: 1 })
  ).toThrowError(ValidationError);
});

test("handleCheckWord: Valid, Banned Input", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: "5",
    REVISION: "1",
  });
  expect(() =>
    handleCheckWord({ maybeWord: "WRONG", revision: 1 })
  ).toThrowError(ValidationError);
});

test("handleCheckWord: Valid, Correct Word", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: "5",
    REVISION: "1",
  });
  const output = handleCheckWord({ maybeWord: "RIGHT", revision: 1 });
  expect(output).toEqual({
    letterState: [2, 2, 2, 2, 2],
  });
});

test("handleCheckWord: Valid, Re-Arranged", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: "5",
    REVISION: "1",
  });
  const output = handleCheckWord({ maybeWord: "TIGHT", revision: 1 });
  expect(output).toEqual({
    letterState: [0, 2, 2, 2, 2],
  });
});

test("handleCheckWord: Valid, Unused Letter", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: "5",
    REVISION: "1",
  });
  const output = handleCheckWord({ maybeWord: "MIGHT", revision: 1 });
  expect(output).toEqual({
    letterState: [0, 2, 2, 2, 2],
  });
});

test("handleCheckWord: Valid, Unused Letter", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "FRESH",
    ROW_LENGTH: "5",
    REVISION: "1",
  });
  const output = handleCheckWord({ maybeWord: "FREED", revision: 1 });
  expect(output).toEqual({
    letterState: [2, 2, 2, 0, 0],
  });
});

test("handleCheckWord: Valid, Unused Letter", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "CRANE",
    ROW_LENGTH: "5",
    REVISION: "1",
  });
  const output = handleCheckWord({ maybeWord: "ERASE", revision: 1 });
  expect(output).toEqual({
    letterState: [0, 2, 2, 0, 2],
  });
});
