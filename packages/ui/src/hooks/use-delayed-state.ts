import { useState, useEffect } from "react";

export function useDelayedState<T>(value: T, emptyValue: T) {
  const [newValue, setState] = useState<T>(emptyValue);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (value !== undefined && value !== emptyValue) {
        setState(value);
      }
    });
  }, [value]);
  return newValue;
}
