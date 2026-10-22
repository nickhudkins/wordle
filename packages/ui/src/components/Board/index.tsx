const API_URL = import.meta.env.VITE_API_URL;
import * as React from "react";
import { useContext, useCallback, useMemo } from "react";

import { Context } from "../../game/context";
import { ConfirmedRow, CurrentRow, EmptyRow } from "../rows";
import { GameOutcome } from "./GameOutcome";
import { Heckle } from "../Heckle";
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
      rowLength,
      numRows,
      infinityMode,
    },
    dispatch,
  } = useContext(Context);
  const emptyRow = useMemo(() => new Array(rowLength).fill(""), [rowLength]);
  const checkRow = useCheckRow();
  const onInteraction = useCallback(
    () => dispatch({ type: "INTERACTION/OCCURRED", payload: null }),
    []
  );
  // Which bonus row (1, 2, 3...) you're currently typing in, if any.
  const bonusRow =
    infinityMode && !gameOutcome && numRows
      ? confirmedRows.length - numRows + 1
      : 0;
  if (!appReady) {
    return null;
  }
  return (
    <>
      <GameOutcome
        gameOutcome={gameOutcome}
        confirmedRows={confirmedRows}
        numRows={numRows}
        infinityMode={infinityMode}
      />
      {confirmedRows.map((row, i) => (
        <ConfirmedRow
          hasInteracted={hasInteracted}
          key={`confirmed-${i}`}
          row={row}
        />
      ))}
      {bonusRow > 0 && (
        <Heckle key={bonusRow} bonusRow={bonusRow} numRows={numRows} />
      )}
      {!gameOutcome && (
        <CurrentRow
          loading={loading}
          hasInteracted={hasInteracted}
          index={confirmedRows.length + 1}
          previousRow={lastConfirmed(confirmedRows)}
          initialRow={emptyRow}
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
