import * as React from "react";
import { useContext } from "react";
import { createUseStyles } from "react-jss";
import { Context } from "../../game/context";
import { useDelayedState } from "../../hooks/use-delayed-state";
import { classnames } from "../../utils";
import { Key } from "./Key";

const useStyles = createUseStyles({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    transition:
      "opacity 1s cubic-bezier(.36,.07,.19,.97), transform .7s cubic-bezier(.36,.07,.19,.97)",
    transform: "translate(0px,50px)",
    opacity: 0,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 10,
  },
  show: {
    opacity: 1,
    transform: "translate(0px, 0px)",
  },
});

const rows = ["qwertyuiop", "asdfghjkl", ">zxcvbnm<"];

export function Keyboard() {
  const {
    state: { usedLetters },
  } = useContext(Context);
  const cx = useStyles();
  const animateIn = useDelayedState(true, false);
  const dynamicCx = classnames(cx);
  const keyboardClasses = dynamicCx({
    container: true,
    show: animateIn,
  });
  return (
    <div className={keyboardClasses}>
      {rows.map((row, i) => {
        const letters = row.split("");
        return (
          <div className={cx.row} key={`row-${i}`}>
            {letters.map((letter, i) => (
              <Key
                key={`key-${letter}-${i}`}
                letter={letter}
                letterState={usedLetters[letter]}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
