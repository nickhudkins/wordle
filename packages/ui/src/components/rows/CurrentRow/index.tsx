import * as React from "react";
import { useState, useLayoutEffect, useEffect } from "react";

import { Letter } from "../../Letter";
import { Row } from "../Row";
import { useKeyboardInput } from "./use-keyboard-input";

import type { ConfirmedRow } from "../../../game/types";

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
  initialRow,
  onConfirm,
  index,
  hasInteracted,
  previousRow,
  onInteraction,
}: CurrentRowProps) {
  const [failed, setFailed] = useState(false);
  const [letters, setLetters] = useState(initialRow);
  // In infinity mode the board grows past the screen. The current row
  // sits right above the keyboard, so scrolling to the bottom keeps
  // both the row you're typing in and the keyboard on screen.
  useEffect(() => {
    if (index > 1) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [index]);

  const reset = () => {
    setLetters(initialRow);
  };
  // If our previous row changes, we have successfully
  // confirmed the word, and the change has flushed.
  // We'll go ahead and useLayoutEffect to avoid a flash
  useLayoutEffect(reset, [previousRow]);

  useKeyboardInput({
    setLetters: (args) => {
      onInteraction();
      setLetters(args);
    },
    onEnter: () => {
      // Clear Failure State
      setFailed(false);
      // If confirmation throws...
      //... set failed to shake the row!
      onConfirm(letters).catch((e) => {
        console.log(e);
        requestAnimationFrame(() => setFailed(true));
      });
    },
  });

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
