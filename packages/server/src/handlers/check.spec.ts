import { createCheckHandler, ValidationError } from "./check";

test("createCheckHandler: Empty Config", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "",
      CORRECT_WORD: "",
      ROW_LENGTH: 5,
    });
  expect(factory).toThrow();
});

test("createCheckHandler: Invalid Config (Impossible: Length)", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "TOO_LONG",
      CORRECT_WORD: "DIFFERENT_LENGTH",
      ROW_LENGTH: 5,
    });
  expect(factory).toThrow();
});

test("createCheckHandler: Invalid Config (Impossible: Same)", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "SAME",
      CORRECT_WORD: "SAME",
      ROW_LENGTH: 4,
    });
  expect(factory).toThrow();
});

test("createCheckHandler: Valid Config", () => {
  const factory = () =>
    createCheckHandler({
      BANNED_WORD: "AAAA",
      CORRECT_WORD: "BBBB",
      ROW_LENGTH: 4,
    });
  expect(factory).not.toThrow();
});

test("handleCheckWord: Invalid Input (Not a Word)", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: 5,
  });
  expect(() => handleCheckWord({ maybeWord: "$$$$$" })).toThrowError(
    ValidationError
  );
});

test("handleCheckWord: Valid, Banned Input", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: 5,
  });
  expect(() => handleCheckWord({ maybeWord: "WRONG" })).toThrowError(
    ValidationError
  );
});

test("handleCheckWord: Valid, Correct Word", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: 5,
  });
  const output = handleCheckWord({ maybeWord: "RIGHT" });
  expect(output).toEqual({
    letterState: [2, 2, 2, 2, 2],
  });
});

test("handleCheckWord: Valid, Re-Arranged", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: 5,
  });
  const output = handleCheckWord({ maybeWord: "TIGHT" });
  expect(output).toEqual({
    letterState: [1, 2, 2, 2, 2],
  });
});

test("handleCheckWord: Valid, Unused Letter", () => {
  const handleCheckWord = createCheckHandler({
    BANNED_WORD: "WRONG",
    CORRECT_WORD: "RIGHT",
    ROW_LENGTH: 5,
  });
  const output = handleCheckWord({ maybeWord: "MIGHT" });
  expect(output).toEqual({
    letterState: [0, 2, 2, 2, 2],
  });
});
