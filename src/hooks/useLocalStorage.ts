// localStorageのカスタムフック

import { useState, useCallback } from 'react';

/**
 * localStorageと同期するステート管理フック
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // localStorageが使えない環境では無視
      }
    },
    [key]
  );

  return [storedValue, setValue];
};
