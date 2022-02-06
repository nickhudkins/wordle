import * as React from "react";
import { useContext } from "react";
import { Context } from "../../game/context";
import { Dialog } from "@reach/dialog";

export const GameAlerts = () => {
  const {
    state: { error },
  } = useContext(Context);
  if (error && error.message === "EXPIRED") {
    return (
      <Dialog aria-label="oh-shoot" isOpen>
        <h1>😭 You took too long!</h1>
        <p>The word has changed since you last played.</p>
      </Dialog>
    );
  }
  if (error) {
    return (
      <Dialog aria-label="nick-broke-something" isOpen>
        <h1>🤷‍♀️ Refresh the page?</h1>
        <p>Nick probably broke something.</p>
      </Dialog>
    );
  }
  return null;
};
