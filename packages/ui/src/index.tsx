import * as React from "react";
import { render } from "react-dom";
import { createUseStyles } from "react-jss";

import { Board } from "./components/Board";
import { GameContextProvider } from "./game/context";
import { useGlobalStyles } from "./global-styles";

const useGameStyles = createUseStyles({
  outerContainer: {
    justifyContent: "center",
    width: "100%",
  },
  container: {
    width: "100%",
    position: "relative",
  },
});

function App() {
  useGlobalStyles();
  const cx = useGameStyles();
  return (
    <GameContextProvider>
      <div className={cx.outerContainer}>
        <h1>Wordle</h1>
        <div className={cx.container}>
          <Board />
        </div>
      </div>
    </GameContextProvider>
  );
}

render(<App />, document.getElementById("root"));
