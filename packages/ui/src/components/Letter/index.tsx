import * as React from "react";
import { createUseStyles } from "react-jss";
import { useDelayedState } from "./use-delayed-state";
import { useConfetti } from "./use-confetti";
import {
  LETTER_HEIGHT,
  CONFIRMED_BG,
  CONFIRMED_FG,
  CORRECT_BG,
  CORRECT_FG,
  EMPTY_BG,
  EMPTY_FG,
  EXISTS_BG,
  EXISTS_FG,
} from "../../theme";

interface LetterProps {
  value: string;
  letterState?: number;
}

const useStyles = createUseStyles({
  container: {
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 8,
    width: LETTER_HEIGHT,
    height: LETTER_HEIGHT,
    textTransform: "uppercase",
    border: [3, "solid", EMPTY_FG],
    transition: "all 1s",
    backgroundColor: EMPTY_BG,
    fontFamily: "Roboto Slab",
    fontWeight: "500",
    color: EMPTY_FG,
    fontSize: 52,
  },
  missing: {
    backgroundColor: CONFIRMED_BG,
    color: CONFIRMED_FG,
  },
  found: {
    backgroundColor: EXISTS_BG,
    color: EXISTS_FG,
  },
  correct: {
    backgroundColor: CORRECT_BG,
    color: CORRECT_FG,
  },
});

export function Letter({ value, letterState }: LetterProps) {
  const cx = useStyles();
  const delayedLetterState = useDelayedState(letterState, -1);
  const ref = useConfetti<HTMLSpanElement>(delayedLetterState);

  const letterStateClass =
    [cx.missing, cx.found, cx.correct][delayedLetterState] || "";
  return (
    <span ref={ref} className={[cx.container, letterStateClass].join(" ")}>
      {value}
    </span>
  );
}
