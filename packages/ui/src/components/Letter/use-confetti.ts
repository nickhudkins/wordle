import { useEffect, useRef } from "react";
import { createConfetti, fireAway } from "./flourish";
import { LETTER_HEIGHT } from "../../theme";

export function useConfetti<T extends HTMLElement>(letterState: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (ref.current) {
      const { x: originalX, y: originalY } =
        ref.current.getBoundingClientRect();
      const x = (originalX + LETTER_HEIGHT / 2) / window.innerWidth;
      const y = (originalY + LETTER_HEIGHT / 2) / window.innerHeight;
      const conf = createConfetti({ origin: { x, y } });
      switch (letterState) {
        case 0:
          break;
        case 1:
          fireAway(conf, 10);
          break;
        case 2:
          fireAway(conf, 500);
          break;
        default:
          break;
      }
    }
  }, [letterState]);
  return ref;
}
