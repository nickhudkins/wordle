import * as React from "react";
import { createUseStyles } from "react-jss";
import { classnames } from "../utils";
import { useDelayedState } from "../hooks/use-delayed-state";

const useTitleStyles = createUseStyles({
  title: {
    fontSize: "1.5em",
    margin: "10px auto",
    textAlign: "center",
    paddingBottom: 10,
    textTransform: "uppercase",
    borderBottom: "3px solid #ccc",
    position: "relative",
    transition:
      "opacity 1.2s cubic-bezier(.36,.07,.19,.97), transform .7s cubic-bezier(.36,.07,.19,.97)",
    transform: "translate(0px,10px)",
    opacity: 0,
  },
  titleShow: {
    opacity: 1,
    transform: "translate(0px,0px)",
  },
  cite: {
    color: "#A8201A",
    fontFamily: "Reenie Beanie",
    opacity: 0,
    position: "absolute",
    right: -50,
    textTransform: "none",
    top: 15,
    transform: "scale(2) rotate(0deg)",
    transition: "all .6s cubic-bezier(0.85, 0, 0.15, 1)",
    transitionDelay: ".5s",
    width: 100,
  },
  citeShow: {
    transform: "scale(1) rotate(-15deg)",
    opacity: 1,
  },
  strike: {
    textDecoration: "line-through",
  },
});

export const Title = () => {
  const cx = classnames(useTitleStyles());
  const animateIn = useDelayedState(true, false);
  const titleClass = cx({
    title: true,
    titleShow: animateIn,
  });
  const citeClass = cx({
    cite: true,
    citeShow: animateIn,
  });
  const strikeClass = cx({
    strike: true,
  });

  return (
    <h1 className={titleClass}>
      <span className={strikeClass}>W</span>Nordle{" "}
      <cite className={citeClass}>by Nick</cite>
    </h1>
  );
};
