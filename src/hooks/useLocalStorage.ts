"use client";

import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      let current: T;
      try {
        const item = window.localStorage.getItem(key);
        current = item ? (JSON.parse(item) as T) : initialValue;
      } catch {
        current = initialValue;
      }
      const nextValue =
        value instanceof Function ? value(current) : value;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      }
      setStoredValue(nextValue);
    },
    [key, initialValue]
  );

  return [storedValue, setValue];
}
