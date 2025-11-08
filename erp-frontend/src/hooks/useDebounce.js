import { useEffect, useState } from "react";

/**
 * useDebounce - delays updating a value until after a given delay.
 * @param {any} value - the value to debounce
 * @param {number} delay - milliseconds delay
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
