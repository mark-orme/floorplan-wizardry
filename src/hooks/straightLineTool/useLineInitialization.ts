
import { useState, useCallback } from 'react';
import { lineToolLogger } from '@/utils/logger';

/**
 * Hook for managing line tool initialization state
 */
export const useLineInitialization = () => {
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    setIsActive(true);
    lineToolLogger.debug('Line tool initialized');
  }, []);
  
  return {
    isActive,
    isToolInitialized,
    setIsActive,
    initializeTool
  };
};
