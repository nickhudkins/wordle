import { useState, useEffect } from "react";

export function useDelayedState<T>(value: T, emptyValue: T, delay?: number) {
  const [newValue, setState] = useState<T>(emptyValue);
  useEffect(() => {
    const delayedCB = () => {
      if (value !== undefined && value !== emptyValue) {
        setState(value);
      }
    };
    let timeoutId: NodeJS.Timeout;
    if (!delay) {
      requestAnimationFrame(delayedCB);
    } else {
      timeoutId = setTimeout(delayedCB, delay);
    }
    return () => clearTimeout(timeoutId);
  }, [value]);
  return newValue;
}
