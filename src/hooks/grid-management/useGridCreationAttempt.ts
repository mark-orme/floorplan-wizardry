
import { useCallback, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { toast } from 'sonner';
import { captureMessage } from '@/utils/sentryUtils';

interface UseGridCreationAttemptProps {
  canvas: fabric.Canvas | null;
  gridSize?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Hook for handling grid creation with automatic retries
 * Useful for ensuring grid is created successfully even when canvas isn't ready
 */
export const useGridCreationAttempt = ({
  canvas,
  gridSize = 20,
  maxRetries = 3,
  retryDelay = 500
}: UseGridCreationAttemptProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const gridObjectsRef = useRef<fabric.Object[]>([]);
  const retryTimeoutRef = useRef<number | null>(null);

  /**
   * Create grid with retry capability
   */
  const createGridWithRetry = useCallback(async () => {
    if (!canvas) {
      setRetryCount(prev => prev + 1);
      
      if (retryCount >= maxRetries) {
        toast.error('Failed to create grid: Canvas not ready');
        captureMessage('Grid creation failed: Canvas not ready after retries', {
          level: 'error',
          extra: { retryCount, maxRetries }
        });
        setIsCreating(false);
        return null;
      }
      
      // Try again after delay
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      retryTimeoutRef.current = window.setTimeout(() => {
        createGridWithRetry();
      }, retryDelay);
      
      return null;
    }
    
    setIsCreating(true);
    
    try {
      // Clear previous grid objects
      gridObjectsRef.current.forEach(obj => canvas.remove(obj));
      gridObjectsRef.current = [];
      
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      
      // Create vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: '#e0e0e0',
          strokeWidth: 0.5,
          selectable: false,
          evented: false
        });
        
        canvas.add(line);
        gridObjectsRef.current.push(line);
      }
      
      // Create horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#e0e0e0',
          strokeWidth: 0.5,
          selectable: false,
          evented: false
        });
        
        canvas.add(line);
        gridObjectsRef.current.push(line);
      }
      
      // Send all grid lines to back
      gridObjectsRef.current.forEach(line => {
        canvas.sendToBack(line);
      });
      
      canvas.renderAll();
      
      setRetryCount(0);
      captureMessage('Grid created successfully', { level: 'info' });
      return gridObjectsRef.current;
    } catch (error) {
      captureMessage('Error creating grid', { 
        level: 'error',
        extra: { error: String(error) } 
      });
      
      setRetryCount(prev => prev + 1);
      
      if (retryCount < maxRetries) {
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        retryTimeoutRef.current = window.setTimeout(() => {
          createGridWithRetry();
        }, retryDelay);
      } else {
        toast.error('Failed to create grid after multiple attempts');
        setIsCreating(false);
      }
      
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [canvas, gridSize, retryCount, maxRetries, retryDelay]);

  /**
   * Cleanup function to remove grid and clear timeouts
   */
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    if (canvas && gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => canvas.remove(obj));
      gridObjectsRef.current = [];
      canvas.renderAll();
    }
    
    setRetryCount(0);
    setIsCreating(false);
  }, [canvas]);

  return {
    createGridWithRetry,
    cleanup,
    isCreating,
    retryCount,
    gridObjects: gridObjectsRef.current
  };
};
