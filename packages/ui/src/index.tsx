import * as React from "react";
import { render } from "react-dom";
import { createUseStyles } from "react-jss";

import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { GameContextProvider } from "./game/context";
import { useGlobalStyles } from "./global-styles";
import { Title } from "./components/Title";

const useGameStyles = createUseStyles({
  outerContainer: {
    justifyContent: "center",
    width: "100%",
    display: "flex",
    marginBottom: 10,
    flexDirection: "column",
  },
  container: {
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  keyboard: {
    flex: 1,
    paddingTop: 10,
  },
  gameboard: {},
});

function App() {
  useGlobalStyles();
  const cx = useGameStyles();

  return (
    <GameContextProvider>
      <div className={cx.outerContainer}>
        <div className={cx.container}>
          <Title />
          <div className={cx.gameboard}>
            <Board />
          </div>
          <div className={cx.keyboard}>
            <Keyboard />
          </div>
        </div>
      </div>
    </GameContextProvider>
  );
}

render(<App />, document.getElementById("root"));
