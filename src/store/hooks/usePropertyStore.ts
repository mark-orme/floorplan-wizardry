
import { useState } from 'react';

// Basic property store implementation
export function usePropertyStore() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const setError = (hasError: boolean, message: string) => {
    setHasError(hasError);
    setErrorMessage(message);
  };
  
  return {
    properties,
    isLoading,
    hasError,
    errorMessage,
    setProperties,
    setLoading,
    setError
  };
}
