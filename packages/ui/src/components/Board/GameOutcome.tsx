import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";
import { Dialog, DialogContent, DialogOverlay } from "@reach/dialog";
import {
  CONFIRMED_BG,
  CONFIRMED_FG,
  CORRECT_BG,
  CORRECT_FG,
} from "../../theme";
import "@reach/dialog/styles.css";

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

function winMessage(attempts: number, numRows: number) {
  const extra = attempts - numRows;
  if (extra <= 0) return "You should be very proud of yourself.";
  if (extra === 1) return "One bonus row. We'll allow it.";
  if (extra <= 4)
    return `That took ${extra} bonus rows. Proud is a strong word.`;
  if (extra <= 14)
    return `${attempts} guesses. Nobody needs to know about this.`;
  return `${attempts} guesses. At this point the word guessed you.`;
}

export function GameOutcome({
  gameOutcome,
  confirmedRows,
  numRows = 6,
  infinityMode = false,
  delayMS = 500,
}) {
  const cx = useStyles();
  const [shared, setShared] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    const attempts = confirmedRows.length;
    const usedBonusRows = attempts > numRows;
    const score = infinityMode ? `${attempts}/∞` : `${attempts}/${numRows}`;
    const brag = usedBonusRows
      ? "♾️ I got there eventually!"
      : "🎉 I am proud of myself!";
    const shareText = `Wordle — by Nick (${new Date().toLocaleDateString()})\n${brag} ${score}\n\n${rows}`;
    navigator.clipboard.writeText(shareText);
    setShared(true);
  }
  useEffect(() => {
    if (!!gameOutcome) {
      const timeout = setTimeout(() => setIsOpen(true), delayMS);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [gameOutcome, delayMS]);
  switch (gameOutcome) {
    case "WINNER":
      return (
        <DialogOverlay
          isOpen={isOpen}
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
        >
          <DialogContent
            aria-label="you-won"
            style={{ boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)" }}
          >
            <h1>You Won</h1>
            <p>{winMessage(confirmedRows.length, numRows)}</p>
            <button className={cx.button} onClick={handleClick}>
              {shared ? "✅ Copied!" : "🎉 Share It!"}
            </button>
          </DialogContent>
        </DialogOverlay>
      );
    case "NOT_WINNER":
      return (
        <Dialog aria-label="you-not-won" isOpen={isOpen}>
          <h1>You did not won.</h1>
          <p>You should try again. That was not great.</p>
          {!infinityMode && (
            <p>(Psst: infinity mode exists. Just saying.)</p>
          )}
        </Dialog>
      );
    default:
      return null;
  }
}
