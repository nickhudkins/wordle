import { createUseStyles } from "react-jss";
import { BOARD_BG } from "./theme";

export const useGlobalStyles = createUseStyles({
  "@global": {
    body: {
      backgroundColor: BOARD_BG,
      fontFamily: "Roboto Slab",
      padding: "0 !important",
      margin: 0,
    },
    "@keyframes fade": {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
    "@keyframes expand": {
      "0%": {
        transform: "translate3d(0,0,0) scale(1.0, 1.0)",
      },
      "50%": {
        transform: "translate3d(0,0,0) scale(1.2, 1.2)",
      },
      "100%": {
        transform: "translate3d(0,0,0) scale(1.0, 1.0)",
      },
    },
    "@keyframes shake": {
      "10%, 90%": {
        transform: "translate3d(-1px, 0, 0)",
      },

      "20%, 80%": {
        transform: "translate3d(2px, 0, 0)",
      },

      "30%, 50%, 70%": {
        transform: "translate3d(-4px, 0, 0)",
      },

      "40%, 60%": {
        transform: "translate3d(4px, 0, 0)",
      },
    },
  },
});
