import * as React from "react";
import { useContext } from "react";
import { Context } from "../../game/context";
import { Dialog } from "@reach/dialog";

export const GameAlerts = () => {
  const {
    state: { error },
  } = useContext(Context);
  if (error) {
    return (
      <Dialog aria-label="oh-shoot" isOpen>
        <h1>Encountered an Error! 😭</h1>
        <p>ERROR_CODE: {error.message}</p>
      </Dialog>
    );
  }
  return null;
};
