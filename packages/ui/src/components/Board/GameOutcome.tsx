import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";
import { Dialog } from "@reach/dialog";
import {
  CONFIRMED_BG,
  CONFIRMED_FG,
  CORRECT_BG,
  CORRECT_FG,
} from "../../theme";
import "@reach/dialog/styles.css";
import { useDelayedState } from "../../hooks/use-delayed-state";

const useStyles = createUseStyles({
  button: {
    appearance: "none",
    backgroundColor: CORRECT_BG,
    color: CORRECT_FG,
    border: "none",
    fontSize: "1.25em",
    padding: [8, 20],
    fontFamily: "Roboto Slab",
    outline: "none",
    transition: "all .1s",
    "&:active": {
      backgroundColor: CONFIRMED_BG,
      color: CONFIRMED_FG,
    },
  },
});

export function GameOutcome({ gameOutcome, confirmedRows }) {
  const cx = useStyles();
  const [shared, setShared] = useState(false);
  const timeout = useRef(null);
  useEffect(() => {
    if (shared) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setShared(false);
      }, 2000);
    }
    return () => clearTimeout(timeout.current);
  }, [shared, setShared]);
  function handleClick(e) {
    e.preventDefault();
    const rows = confirmedRows
      .map((row) =>
        row
          .map(({ letterState }) => {
            switch (letterState) {
              case 0:
                return "😑";
              case 1:
                return "😏";
              case 2:
                return "😃";
            }
          })
          .join("")
      )
      .join("\n");
    const shareText = `Wordle — by Nick (${new Date().toLocaleDateString()})\n🎉 I am proud of myself! ${
      confirmedRows.length
    }/6\n\n${rows}`;
    navigator.clipboard.writeText(shareText);
    setShared(true);
  }
  const isOpen = useDelayedState(true, false, 1000);
  switch (gameOutcome) {
    case "WINNER":
      return (
        <Dialog aria-label="you-won" isOpen={isOpen}>
          <h1>You Won</h1>
          <p>You should be very proud of yourself.</p>
          <button className={cx.button} onClick={handleClick}>
            {shared ? "✅ Copied!" : "🎉 Share It!"}
          </button>
        </Dialog>
      );
    case "NOT_WINNER":
      return (
        <Dialog aria-label="you-not-won" isOpen={isOpen}>
          <h1>You did not won.</h1>
          <p>You should try again. That was not great.</p>
        </Dialog>
      );
    default:
      return null;
  }
}
