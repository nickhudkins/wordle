import * as React from "react";
import { createUseStyles } from "react-jss";

// One per bonus row, getting meaner as you go.
const HECKLES = [
  "ok, one more. no big deal.",
  "oh my god, why are you so bad at this",
  "have you tried... vowels?",
  "the word is 5 letters. you know that, right?",
  "i'm not mad. i'm just disappointed.",
  "my grandma got it in 4. she's been dead since 2011.",
  "are you just typing words you like now?",
  "this is getting hard to watch",
  "should i call someone?",
  "the keyboard is right there. the colors mean things.",
  "you know what, take your time. i've got nowhere to be.",
  "genuinely impressive. in a bad way.",
  "nick is reading these, by the way",
  "i'm starting to think you're doing this on purpose",
];

// Once we run out, keep rotating through the greatest hits.
const ENCORES = [
  "still here, huh",
  "row {n}. ROW {n}.",
  "i've stopped counting. jk it's {n}.",
  "the sun will burn out before you get this",
  "please. i'm begging you.",
  "{n} rows. this board is taller than you.",
];

export function heckleFor(bonusRow: number, numRows = 6): string {
  const n = bonusRow + numRows;
  const line =
    bonusRow <= HECKLES.length
      ? HECKLES[bonusRow - 1]
      : ENCORES[(bonusRow - HECKLES.length - 1) % ENCORES.length];
  return line.replace(/\{n\}/g, String(n));
}

const useStyles = createUseStyles({
  "@keyframes heckle-in": {
    from: { opacity: 0, transform: "scale(1.6) rotate(0deg)" },
    to: { opacity: 1, transform: "scale(1) rotate(var(--tilt))" },
  },
  note: {
    color: "#A8201A",
    fontFamily: "'Reenie Beanie', cursive",
    fontSize: "1.6em",
    lineHeight: 1.1,
    textAlign: "center",
    margin: [2, "auto", 6],
    maxWidth: "90%",
    transform: "rotate(var(--tilt))",
    animation: "$heckle-in .5s cubic-bezier(0.85, 0, 0.15, 1) both",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export function Heckle({
  bonusRow,
  numRows,
}: {
  bonusRow: number;
  numRows?: number;
}) {
  const cx = useStyles();
  // Alternate the tilt so it looks scribbled, not stamped.
  const tilt = bonusRow % 2 ? "-2deg" : "1.5deg";
  return (
    <p
      className={cx.note}
      style={{ ["--tilt" as any]: tilt }}
      role="status"
    >
      {heckleFor(bonusRow, numRows)}
    </p>
  );
}
