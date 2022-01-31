import * as React from "react";

export function GameOutcome({ gameOutcome }) {
  switch (gameOutcome) {
    case "WINNER":
      return <h1>You Won!</h1>;
    case "NOT_WINNER":
      return <h1>Oof</h1>;
    default:
      return null;
  }
}
