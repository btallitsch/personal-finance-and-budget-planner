import { useState, useCallback } from "react";

/**
 * Persists state to localStorage automatically.
 * Usage: const [value, setValue] = useStorage("my-key", defaultValue);
 */
export function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (v) => {
      const next = typeof v === "function" ? v(val) : v;
      setVal(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        console.warn(`useStorage: could not persist key "${key}"`);
      }
    },
    [key, val]
  );

  return [val, set];
}
