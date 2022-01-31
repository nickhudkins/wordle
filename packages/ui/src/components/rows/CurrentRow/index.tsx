import * as React from "react";
import { useState, useLayoutEffect, useRef } from "react";

import type { ConfirmedRow } from "../../../game/types";

import { Letter } from "../../Letter";
import { Row } from "../Row";
import { useKeyboardInput } from "./use-keyboard-input";

interface CurrentRowProps {
  initialRow: string[];
  previousRow: ConfirmedRow;
  onConfirm: (letters: string[]) => Promise<void>;
}

export function CurrentRow({
  initialRow,
  onConfirm,
  previousRow,
}: CurrentRowProps) {
  const { current: initialState } = useRef(initialRow);
  const [letters, setLetters] = useState(initialState);
  const [failed, setFailed] = useState(false);
  useKeyboardInput({
    setLetters,
    onEnter: () => {
      // Clear Failure State
      setFailed(false);
      // If confirmation throws...
      //... set failed to shake the row!
      onConfirm(letters).catch(() => setFailed(true));
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
        <Letter value={letter} key={`current-row-letter-${i}`} />
      ))}
    </Row>
  );
}
