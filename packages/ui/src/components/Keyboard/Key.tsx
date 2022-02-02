import * as React from "react";
import { createUseStyles } from "react-jss";
import {
  CONFIRMED_BG,
  CONFIRMED_FG,
  EXISTS_BG,
  EXISTS_FG,
  CORRECT_BG,
  CORRECT_FG,
} from "../../theme";
import { classnames, letterUsage } from "../../utils";
import { keyboardOverrides } from "./parts";

const syntheticKeyDown = (keyCode: string) =>
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: keyCode,
    })
  );

const popIn = {
  animation: "expand 0.3s cubic-bezier(.36,.07,.19,.97) both",
  backfaceVisibility: "hidden",
  perspective: 1000,
};

const useStyles = createUseStyles({
  letter: {
    appearance: "none",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 3,
    textAlign: "center",
    fontFamily: "Roboto Slab",
    color: CONFIRMED_BG,
    textTransform: "uppercase",
    flex: 1,
    maxWidth: 40,
    margin: [0, 4],
    height: 48,
    transition: "all .2s",
    userSelect: "none",
    "& path": {
      fill: CONFIRMED_BG,
    },
    "&:active": {
      backgroundColor: CONFIRMED_BG,
      color: CONFIRMED_FG,
      "& path": {
        fill: CONFIRMED_FG,
      },
    },
  },
  used: {
    backgroundColor: CONFIRMED_BG,
    color: CONFIRMED_FG,
    ...popIn,
  },
  found: {
    backgroundColor: EXISTS_BG,
    color: EXISTS_FG,
    ...popIn,
  },
  correct: {
    backgroundColor: CORRECT_BG,
    color: CORRECT_FG,
    ...popIn,
  },
  button: {
    display: "block",
    appearance: "none",
    margin: "0 10px",
    border: "none",
    height: 40,
    flex: 1,
  },
});

export function Key({ letter, letterState }) {
  const cx = useStyles();
  const dynamicCx = classnames(cx);
  const usage = letterUsage(letterState);
  const letterMap = keyboardOverrides[letter] || {
    keyCode: letter,
    component: letter,
  };
  const { keyCode, component } = letterMap;
  const usedLetterClass = dynamicCx({
    letter: true,
    ...usage,
  });
  return (
    <button
      onClick={() => syntheticKeyDown(keyCode)}
      className={usedLetterClass}
    >
      {component}
    </button>
  );
}
