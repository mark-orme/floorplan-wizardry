
import { useState, useRef, useCallback } from 'react';
import { Line } from 'fabric';
import { toolsLogger } from '@/utils/logger';

/**
 * Hook for managing line tool initialization
 */
export const useLineInitialization = () => {
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const lineRef = useRef<Line | null>(null);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    setIsActive(true);
    toolsLogger.debug('Line tool initialized');
  }, []);
  
  /**
   * Initialize line on canvas
   */
  const initializeLine = useCallback((
    startX: number,
    startY: number,
    options: {
      color: string;
      thickness: number;
      dashed?: boolean;
    }
  ) => {
    const line = new Line([startX, startY, startX, startY], {
      stroke: options.color,
      strokeWidth: options.thickness,
      strokeDashArray: options.dashed ? [5, 5] : undefined,
      selectable: false
    });
    
    lineRef.current = line;
    return line;
  }, []);
  
  /**
   * Clean up line
   */
  const cleanupLine = useCallback(() => {
    lineRef.current = null;
  }, []);
  
  return {
    isActive,
    isToolInitialized,
    setIsActive,
    initializeTool,
    initializeLine,
    cleanupLine,
    lineRef
  };
};
