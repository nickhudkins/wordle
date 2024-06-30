import { ValidationError } from "./errors";
import { createCheckHandler, getLetterState } from "./check";

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

test("getLetterState: Valid, Exactly Correct Word", () => {
  const letterState = getLetterState("RIGHT", "RIGHT");
  expect(letterState).toEqual([2, 2, 2, 2, 2]);
});

test("getLetterState: Valid, Re-Arranged", () => {
  const letterState = getLetterState("RIGHT", "TIGHT");
  expect(letterState).toEqual([0, 2, 2, 2, 2]);
});

test("getLetterState: Valid, Unused Letter", () => {
  const letterState = getLetterState("RIGHT", "MIGHT");
  expect(letterState).toEqual([0, 2, 2, 2, 2]);
});

test("getLetterState: Valid, Multi-Guess, Single-Exact", () => {
  const letterState = getLetterState("FRESH", "FREED");
  expect(letterState).toEqual([2, 2, 2, 0, 0]);
});

test("getLetterState: Valid, Multi-Guess, Single-Exact", () => {
  const letterState = getLetterState("CRANE", "ERASE");
  expect(letterState).toEqual([0, 2, 2, 0, 2]);
});

test("handleCheckWord: Valid, Unused Letter", () => {
  const letterState = getLetterState("CRANE", "TREAD");
  expect(letterState).toEqual([0, 2, 1, 1, 0]);
});

test("handleCheckWord: Valid, Multi-Guess, Multi-Just-Found", () => {
  const letterState = getLetterState("SHEAR", "ERASE");
  expect(letterState).toEqual([1, 1, 1, 1, 0]);
});

test("handleCheckWord: Valid, Multi-Guess, Multi-Exact", () => {
  const letterState = getLetterState("TAFIA", "TIBIA");
  expect(letterState).toEqual([2, 0, 0, 2, 2]);
});

test("handleCheckWord: Valid, Multi-Guess, Single-Just-Found, Multi-Exact", () => {
  const letterState = getLetterState("TIBIA", "TAIIA");
  expect(letterState).toEqual([2, 0, 1, 2, 2]);
});
