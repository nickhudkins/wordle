import * as React from "react";
import { useState, useLayoutEffect, useRef } from "react";

import type { ConfirmedRow } from "../../../game/types";

import { Letter } from "../../Letter";
import { Row } from "../Row";
import { useKeyboardInput } from "./use-keyboard-input";

interface CurrentRowProps {
  loading: boolean;
  index: number;
  hasInteracted: boolean;
  initialRow: string[];
  previousRow: ConfirmedRow;
  onInteraction: () => void;
  onConfirm: (letters: string[]) => Promise<void>;
}

export function CurrentRow({
  loading,
  initialRow,
  onConfirm,
  index,
  hasInteracted,
  previousRow,
  onInteraction,
}: CurrentRowProps) {
  const { current: initialState } = useRef(initialRow);
  const [letters, setLetters] = useState(initialState);
  const [failed, setFailed] = useState(false);
  const _setLetters = (args) => {
    onInteraction();
    setLetters(args);
  };
  useKeyboardInput({
    setLetters: _setLetters,
    onEnter: () => {
      // Let's bail early if we know
      // we're waiting on the server
      if (loading) return;
      // Clear Failure State
      setFailed(false);
      // If confirmation throws...
      //... set failed to shake the row!
      onConfirm(letters).catch(() => {
        requestAnimationFrame(() => setFailed(true));
      });
    },
  });
  // We clear once our confirmedRows
  // update has made it to us
  useLayoutEffect(() => {
    setLetters(initialState);
  }, [previousRow]);
  return (
    <Row failed={failed}>
      {letters.map((letter, i) => (
        <Letter
          hasInteracted={hasInteracted}
          row={index}
          index={i}
          value={letter}
          key={`current-row-letter-${i}`}
        />
      ))}
    </Row>
  );
}
