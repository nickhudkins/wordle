import { ValidationError } from "./handlers/errors";
import { errorResponse } from "./http";

test("errorResponse: ValidationError", () => {
  const out = errorResponse(new ValidationError("INVALID"));
  expect(out.statusCode).toBe(400);
});

test("errorResponse: UnexpectedError", () => {
  const out = errorResponse(new Error("Unexpected"));
  expect(out.statusCode).toBe(500);
});
