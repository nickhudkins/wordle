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
  "@keyframes heckle-slap": {
    "0%": { opacity: 0, transform: "translateY(-78%) scale(1.5) rotate(0deg)" },
    "70%": { opacity: 1, transform: "translateY(-78%) scale(0.96) rotate(var(--tilt))" },
    "100%": { opacity: 1, transform: "translateY(-78%) scale(1) rotate(var(--tilt))" },
  },
  "@keyframes heckle-crumple": {
    to: {
      opacity: 0,
      transform: "translateY(-78%) scale(0.2) rotate(calc(var(--tilt) * -20))",
    },
  },
  // Zero-height anchor sitting on the seam between the last guess
  // and the new row, so the note takes up no space of its own.
  anchor: {
    position: "relative",
    height: 0,
    zIndex: 2,
  },
  note: {
    position: "absolute",
    top: 0,
    maxWidth: "68%",
    padding: [6, 14, 8],
    border: "none",
    background: "#FFFDF7",
    // Faint ruled lines, like it was torn out of a notebook.
    backgroundImage:
      "repeating-linear-gradient(transparent 0 21px, #D9E4F0 21px 22px)",
    boxShadow: "0 6px 14px rgba(50, 50, 44, 0.35), 0 1px 2px rgba(50, 50, 44, 0.3)",
    color: "#A8201A",
    fontFamily: "'Reenie Beanie', cursive",
    fontSize: "1.55em",
    lineHeight: "22px",
    textAlign: "left",
    cursor: "pointer",
    transform: "translateY(-78%) rotate(var(--tilt))",
    animation: "$heckle-slap .45s cubic-bezier(.2, .9, .3, 1.2) both",
    // A strip of tape holding it on.
    "&::before": {
      content: '""',
      position: "absolute",
      top: -9,
      left: "50%",
      width: 54,
      height: 18,
      marginLeft: -27,
      background: "rgba(252, 175, 88, 0.55)",
      transform: "rotate(-4deg)",
    },
    "&:focus-visible": {
      outline: "2px solid #32322C",
      outlineOffset: 3,
    },
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
  left: { left: "4%" },
  right: { right: "4%" },
  crumpling: {
    animation: "$heckle-crumple .3s ease-in forwards",
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
  const [state, setState] = React.useState<"shown" | "crumpling" | "gone">(
    "shown"
  );
  if (state === "gone") return null;

  // Alternate sides and tilt so each note looks slapped on by hand.
  const onLeft = bonusRow % 2 === 1;
  const tilt = onLeft ? "-3deg" : "2.5deg";
  const className = [
    cx.note,
    onLeft ? cx.left : cx.right,
    state === "crumpling" ? cx.crumpling : "",
  ].join(" ");

  return (
    <div className={cx.anchor}>
      <button
        type="button"
        className={className}
        style={{ ["--tilt" as any]: tilt }}
        role="status"
        title="Tap to crumple"
        onClick={(e) => {
          // Keep Enter for submitting guesses.
          e.currentTarget.blur();
          setState("crumpling");
        }}
        onAnimationEnd={() => {
          if (state === "crumpling") setState("gone");
        }}
      >
        {heckleFor(bonusRow, numRows)}
      </button>
    </div>
  );
}
