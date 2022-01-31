import * as React from "react";
import type { FC } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  shake: {
    animation: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
    transform: "translate3d(0, 0, 0)",
    backfaceVisibility: "hidden",
    perspective: 1000,
  },
});

interface RowProps {
  failed?: boolean;
}

export const Row: FC<RowProps> = ({ children, failed }) => {
  const cx = useStyles();
  const classes = [cx.container];
  if (failed) {
    classes.push(cx.shake);
  }
  return <div className={classes.join(" ")}>{children}</div>;
};
