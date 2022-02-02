import { useEffect, useCallback } from "react";
import { nonEmpty, isEmpty } from "../../../utils";

type EventHandler = (e: KeyboardEvent) => void;

const addKeyDown = (cb: EventHandler) =>
  document.addEventListener("keydown", cb);

const removeKeyDown = (cb: EventHandler) =>
  document.removeEventListener("keydown", cb);

function isValidAlpha(e: KeyboardEvent): boolean {
  const isValidKey = /^[A-Za-z]{0,1}$/.test(e.key);
  const isModified = e.metaKey || e.altKey || e.ctrlKey;
  return isValidKey && !isModified;
}

type SetLetters = React.Dispatch<React.SetStateAction<string[]>>;
type KeyboardInputProps = {
  setLetters: SetLetters;
  onEnter: () => void;
};

export function useKeyboardInput({ setLetters, onEnter }: KeyboardInputProps) {
  const cb = useCallback(
    (e: KeyboardEvent) => {
      // TODO: Ignore input if we're at max length.
      const isDelete = e.key === "Backspace";
      if (isValidAlpha(e)) {
        setLetters((prevLetters) => {
          // Ignorable if everything is "full"
          if (prevLetters.every(nonEmpty)) return prevLetters;

          const maxLength = prevLetters.length;
          const firstEmpty = prevLetters.indexOf("");
          const before = prevLetters.slice(0, firstEmpty);
          const after = prevLetters.slice(firstEmpty);
          return [...before, e.key, ...after].slice(0, maxLength);
        });
      } else if (isDelete) {
        setLetters((prevLetters) => {
          // No need to copy if we're empty
          if (prevLetters.every(isEmpty)) return prevLetters;

          const maxLength = prevLetters.length;
          const padding = new Array(maxLength).fill("");
          const afterDelete = prevLetters.filter(nonEmpty).slice(0, -1);
          return [...afterDelete, ...padding].slice(0, maxLength);
        });
      } else if (e.key === "Enter") {
        onEnter();
      }
    },
    [setLetters, onEnter]
  );

  useEffect(() => {
    addKeyDown(cb);
    return () => removeKeyDown(cb);
  }, [cb]);
}
