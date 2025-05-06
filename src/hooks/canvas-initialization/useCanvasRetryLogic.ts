import { useState, useEffect, useRef } from 'react';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
}

interface RetryState {
  count?: number;
  delay?: number;
  error?: Error | null;
}

/**
 * Hook for implementing retry logic with exponential backoff
 * @param initialize - Function to initialize the resource
 * @param options - Retry options
 * @returns Object containing retry state and control functions
 */
export const useCanvasRetryLogic = <T>(
  initialize: () => Promise<T>,
  options: RetryOptions = {}
) => {
  const [retryState, setRetryState] = useState<RetryState>({
    count: 0,
    delay: options.baseDelay || 1000,
    error: null
  });
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const retryOptions = useRef(options);
  
  useEffect(() => {
    retryOptions.current = options;
  }, [options]);
  
  const initializeResource = async () => {
    setIsLoading(true);
    setRetryState(prev => ({ ...prev, error: null }));
    
    try {
      const result = await initialize();
      setData(result);
      setIsReady(true);
      setIsLoading(false);
      setRetryState({ count: 0, delay: retryOptions.current.baseDelay || 1000, error: null });
    } catch (error: any) {
      setIsReady(false);
      setIsLoading(false);
      setRetryState(prev => ({ ...prev, error: error instanceof Error ? error : new Error(String(error)) }));
    }
  };
  
  useEffect(() => {
    initializeResource();
  }, []);
  
  useEffect(() => {
    if (retryState.error && retryState.count !== undefined && retryOptions.current.maxRetries !== undefined) {
      if (retryState.count >= retryOptions.current.maxRetries) {
        console.error('Max retries reached');
        return;
      }
      
      const timeoutId = setTimeout(() => {
        setRetryState(prev => ({
          count: (prev.count || 0) + 1,
          delay: prev.delay ? prev.delay * 2 : retryOptions.current.baseDelay || 1000,
          error: null
        }));
        
        initializeResource();
      }, retryState.delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [retryState.error, retryState.count, retryState.delay, retryOptions.current.maxRetries]);
  
  const handleRetry = () => {
    if (retryState && retryState.count !== undefined && retryOptions.current && retryOptions.current.maxRetries !== undefined) {
      if (retryState.count >= retryOptions.current.maxRetries) {
        console.warn('Max retries reached');
        return;
      }
    }
    
    if (retryState && retryState.delay !== undefined && retryOptions.current && retryOptions.current.baseDelay !== undefined) {
      const newDelay = retryOptions.current.baseDelay || 1000;
      setRetryState(prev => ({ ...prev, delay: newDelay }));
    }
    
    initializeResource();
  };
  
  return {
    data,
    isLoading,
    isReady,
    retryState,
    handleRetry
  };
};
