
import { useState, useEffect } from 'react';

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

// For backward compatibility
export function useDebounce<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  
  const debounce = (fn: Function, delay: number) => {
    let timeout: number | undefined;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay) as unknown as number;
    };
  };

  return debounce;
}
