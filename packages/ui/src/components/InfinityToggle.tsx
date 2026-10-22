import * as React from "react";
import { useContext } from "react";
import { createUseStyles } from "react-jss";
import { Context } from "../game/context";
import { CONFIRMED_BG, CORRECT_BG, CORRECT_FG } from "../theme";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 10,
  },
  toggle: {
    appearance: "none",
    border: `2px solid ${CONFIRMED_BG}`,
    borderRadius: 999,
    background: "transparent",
    color: CONFIRMED_BG,
    cursor: "pointer",
    fontFamily: "Roboto Slab",
    fontSize: "0.85em",
    padding: [4, 14],
    transition: "all .15s",
    "&:disabled": {
      cursor: "default",
      opacity: 0.5,
    },
  },
  on: {
    background: CORRECT_BG,
    borderColor: CORRECT_BG,
    color: CORRECT_FG,
  },
});

export function InfinityToggle() {
  const cx = useStyles();
  const {
    state: { appReady, infinityMode, gameOutcome },
    dispatch,
  } = useContext(Context);

  if (!appReady) return null;

  return (
    <div className={cx.wrapper}>
      <button
        type="button"
        aria-pressed={infinityMode}
        disabled={Boolean(gameOutcome)}
        title={
          infinityMode
            ? "Out of rows? Have another. And another."
            : "Never run out of guesses"
        }
        className={`${cx.toggle} ${infinityMode ? cx.on : ""}`}
        onClick={(e) => {
          // Drop focus so pressing Enter submits a guess
          // instead of toggling the mode again.
          e.currentTarget.blur();
          dispatch({ type: "INFINITY_MODE/TOGGLE", payload: null });
        }}
      >
        ♾️ Infinity mode: {infinityMode ? "ON" : "off"}
      </button>
    </div>
  );
}
