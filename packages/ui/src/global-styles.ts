import { createUseStyles } from "react-jss";
import { BOARD_BG } from "./theme";

export const useGlobalStyles = createUseStyles({
  "@global": {
    body: {
      backgroundColor: BOARD_BG,
      fontFamily: "Roboto Slab",
      padding: 0,
    },
    h1: {
      margin: "20px auto",
      textAlign: "center",
      paddingBottom: 20,
      textTransform: "uppercase",
      borderBottom: "3px solid #ccc",
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
