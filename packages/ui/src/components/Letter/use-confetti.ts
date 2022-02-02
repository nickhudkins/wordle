import { useEffect, useRef } from "react";
import { createConfetti, realisticConfetti } from "./flourish";

export function useConfetti<T extends HTMLElement>(letterState: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (ref.current) {
      const {
        x: originalX,
        y: originalY,
        width,
        height,
      } = ref.current.getBoundingClientRect();
      const x = (originalX + width / 2) / window.innerWidth;
      const y = (originalY + height / 2) / window.innerHeight;
      const conf = createConfetti({ origin: { x, y } });
      switch (letterState) {
        case 0:
          break;
        case 1:
          realisticConfetti(conf, 10);
          break;
        case 2:
          realisticConfetti(conf, 200);
          break;
        default:
          break;
      }
    }
  }, [letterState]);
  return ref;
}
