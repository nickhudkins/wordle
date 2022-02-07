import { useContext } from "react";
import { Context } from "../../../game/context";
import { GameDispatch } from "../../../game/types";
import { nonEmpty } from "../../../utils";

const createStartAction = (dispatch: GameDispatch) => () =>
  dispatch({
    type: "CONFIRM_ROW/START",
    payload: null,
  });

const createCompleteAction = (dispatch: GameDispatch) => (payload: any) =>
  dispatch({
    type: "CONFIRM_ROW/COMPLETE",
    payload,
  });

const createRejectAction = (dispatch: GameDispatch) => (reason?: any) => {
  dispatch({
    type: "CONFIRM_ROW/REJECT",
    payload: {
      reason,
    },
  });
};

export function useCheckRow() {
  const {
    state: { gameOutcome, loading },
    dispatch,
    wordleAPI,
  } = useContext(Context);
  const startConfirm = createStartAction(dispatch);
  const rejectConfirm = createRejectAction(dispatch);
  const completeConfirm = createCompleteAction(dispatch);
  return async (row: string[]) => {
    // Loading, or the game has ended one way or another
    if (loading || Boolean(gameOutcome)) return Promise.resolve();

    const isReady = row.every(nonEmpty);
    if (isReady) {
      const word = row.join("");
      startConfirm();
      const {
        letterState,
        error,
        message: errorMessage,
        name: errorName,
      } = await wordleAPI(`/check/${word}`);

      if (error) {
        const builtError = new Error(`${errorName}: ${errorMessage}`);
        switch (errorName) {
          case "ValidationError":
            rejectConfirm();
            break;
          case "ExpiredGameError":
            rejectConfirm(builtError);
            break;
        }
        return Promise.reject(builtError);
      }
      const completionPayload = row.map((l, i) => ({
        value: l,
        letterState: letterState[i],
      }));
      return completeConfirm(completionPayload);
    }
    return Promise.reject(new Error("ValidationError: Incomplete Word"));
  };
}
