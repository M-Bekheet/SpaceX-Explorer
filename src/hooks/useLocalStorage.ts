"use client";

import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  const serialized = JSON.stringify(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValue);
    } catch {
      setStoredValue(initialValue);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, serialized]);

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
    [key, serialized]
  );

  return [storedValue, setValue, hydrated];
}
