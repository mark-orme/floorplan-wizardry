
/**
 * Web Worker Hook
 * Generic hook for creating and managing web workers
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface WorkerResult<T> {
  messageId: number;
  data: T;
}

/**
 * Hook for using web workers with typed messages
 */
export function useWebWorker<TMessage, TResult>(scriptUrl: string) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [result, setResult] = useState<WorkerResult<TResult> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Message ID counter for tracking responses
  const messageIdCounter = useRef(0);
  
  // Initialize worker
  useEffect(() => {
    let workerInstance: Worker | null = null;
    
    try {
      workerInstance = new Worker(scriptUrl);
      
      // Set up message and error handlers
      workerInstance.onmessage = (event) => {
        const { messageId, data } = event.data;
        setResult({ messageId, data });
        setIsProcessing(false);
      };
      
      workerInstance.onerror = (e) => {
        console.error('Worker error:', e);
        setError(`Worker error: ${e.message}`);
        setIsProcessing(false);
      };
      
      setWorker(workerInstance);
    } catch (err) {
      console.error('Failed to create worker:', err);
      setError(err instanceof Error ? err.message : 'Failed to create worker');
    }
    
    // Clean up worker on unmount
    return () => {
      if (workerInstance) {
        workerInstance.terminate();
      }
    };
  }, [scriptUrl]);
  
  /**
   * Post a message to the worker
   */
  const postMessage = useCallback((message: TMessage): number => {
    if (!worker) {
      throw new Error('Worker not initialized');
    }
    
    const messageId = messageIdCounter.current++;
    setIsProcessing(true);
    
    worker.postMessage({
      messageId,
      data: message
    });
    
    return messageId;
  }, [worker]);
  
  /**
   * Terminate the worker
   */
  const terminateWorker = useCallback(() => {
    if (worker) {
      worker.terminate();
      setWorker(null);
    }
  }, [worker]);
  
  return {
    worker,
    postMessage,
    result,
    isProcessing,
    error,
    terminateWorker
  };
}
