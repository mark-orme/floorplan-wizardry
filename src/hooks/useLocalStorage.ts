
/**
 * Hook for working with localStorage
 * @module hooks/useLocalStorage
 */
import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with type safety
 * 
 * @param key Storage key
 * @param initialValue Initial value
 * @returns Storage state and setter
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store the value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Update localStorage whenever the stored value changes
  useEffect(() => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = storedValue instanceof Function ? storedValue(storedValue) : storedValue;
      
      // Save to local storage
      if (valueToStore === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue] as const;
}
