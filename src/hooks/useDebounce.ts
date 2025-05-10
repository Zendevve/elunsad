
import { useState, useEffect } from 'react';

// Main implementation as default export
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Legacy debounce function with different signature (not named useDebounce to avoid duplicate)
export function createDebounce<T>(initialValue: T) {
  const debounce = (fn: Function, delay: number) => {
    let timeout: number | undefined;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay) as unknown as number;
    };
  };

  return debounce;
}
