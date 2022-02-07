import * as React from "react";
import { createUseStyles } from "react-jss";
import { useDelayedState } from "../../hooks/use-delayed-state";
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
import { classnames, letterUsage } from "../../utils";

interface LetterProps {
  value: string;
  index: number;
  row?: number;
  hasInteracted?: boolean;
  letterState?: number;
}

const styles = {
  container: {
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 8,
    maxWidth: 72,
    flex: 1,
    aspectRatio: 1 / 1,
    textTransform: "uppercase",
    border: [3, "solid", CONFIRMED_BG],
    transition: "all 1s, opacity 0s",
    backgroundColor: EMPTY_BG,
    fontFamily: "Roboto Slab",
    fontWeight: "500",
    color: EMPTY_FG,
    opacity: 0,
    fontSize: LETTER_HEIGHT * 0.6,
    transform: "translate3d(0,0,0)",
  },
  show: ({ row, index, hasInteracted }) => ({
    animationDelay: `${
      Math.random() *
      ((Math.max(row, 1) * Math.max(index, 1)) /
        (Math.max(row, 1) + Math.max(index, 1))) *
      0.5
    }s`,
    animation:
      row !== undefined && index !== undefined && !hasInteracted
        ? "fade 1s cubic-bezier(.36,.07,.19,.97) both"
        : "",
    backfaceVisibility: "hidden",
    perspective: 1000,
    opacity: 1,
  }),
  used: {
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
  justEntered: ({ letterState, index }) => ({
    animationDelay: letterState !== undefined ? `${index * 0.05}s` : "0",
    animation: "expand 0.2s cubic-bezier(.36,.07,.19,.97) both",
    backfaceVisibility: "hidden",
    perspective: 1000,
  }),
};

const useStyles = createUseStyles<
  "container" | "show" | "used" | "found" | "correct" | "justEntered",
  Pick<LetterProps, "index" | "row" | "hasInteracted" | "letterState">
>(styles);

function InternalLetter({
  value,
  letterState,
  row,
  index,
  hasInteracted,
}: LetterProps) {
  const cx = useStyles({ letterState, index, row, hasInteracted });
  const animateIn = useDelayedState(true, false);
  const delayedLetterState = useDelayedState(letterState, -1);
  const delayedLetterValue = useDelayedState(value, "");
  const ref = useConfetti<HTMLSpanElement>(delayedLetterState);

  const dynamicCx = classnames(cx);
  const letterClass = dynamicCx({
    container: true,
    show: animateIn,
    justEntered: delayedLetterValue !== "",
    ...letterUsage(delayedLetterState),
  });
  return (
    <span ref={ref} className={letterClass}>
      {value}
    </span>
  );
}

export const Letter = React.memo(InternalLetter);
