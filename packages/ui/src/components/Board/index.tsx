const API_URL = import.meta.env.VITE_API_URL;
import * as React from "react";
import { useContext, useCallback } from "react";

import { Context } from "../../game/context";
import { ConfirmedRow, CurrentRow, EmptyRow } from "../rows";
import { GameOutcome } from "./GameOutcome";
import { useCheckRow } from "../rows/CurrentRow/use-check-row";
import type { ConfirmedRow as ConfirmedRowT } from "../../game/types";

const empty: ConfirmedRowT = [];

function lastConfirmed(confirmedRows: ConfirmedRowT[]): ConfirmedRowT {
  const lastConfirmedRow = confirmedRows[confirmedRows.length - 1];
  return lastConfirmedRow || empty;
}

export function Board() {
  const {
    state: {
      appReady,
      hasInteracted,
      confirmedRows,
      gameOutcome,
      placeholderRows,
      loading,
    },
    dispatch,
  } = useContext(Context);
  const checkRow = useCheckRow();
  const onInteraction = useCallback(
    () => dispatch({ type: "INTERACTION/OCCURRED", payload: null }),
    []
  );
  if (!appReady) {
    return null;
  }
  return (
    <>
      <GameOutcome gameOutcome={gameOutcome} confirmedRows={confirmedRows} />
      {confirmedRows.map((row, i) => (
        <ConfirmedRow
          hasInteracted={hasInteracted}
          key={`confirmed-${i}`}
          row={row}
        />
      ))}
      {!gameOutcome && (
        <CurrentRow
          loading={loading}
          hasInteracted={hasInteracted}
          index={confirmedRows.length + 1}
          previousRow={lastConfirmed(confirmedRows)}
          initialRow={placeholderRows[0]}
          onConfirm={checkRow}
          onInteraction={onInteraction}
        />
      )}
      {placeholderRows.map((row, i) => (
        <EmptyRow key={`empty-${i}`} row={row} index={i} />
      ))}
    </>
  );
}
