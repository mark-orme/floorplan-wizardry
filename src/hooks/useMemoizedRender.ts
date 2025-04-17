
import { useCallback, useMemo, useRef } from 'react';

/**
 * Hook for creating memoized rendering functions and tracking render counts
 * Useful for debugging and optimizing component renders
 */
export const useMemoizedRender = (componentName: string = 'Component') => {
  // Track render count for debugging
  const renderCount = useRef(0);
  
  // Increment render count on each render
  renderCount.current += 1;
  
  // Memoized function to check if an object has changed
  const hasChanged = useCallback((prevObj: any, nextObj: any): boolean => {
    if (prevObj === nextObj) return false;
    
    // Special handling for arrays
    if (Array.isArray(prevObj) && Array.isArray(nextObj)) {
      if (prevObj.length !== nextObj.length) return true;
      
      // Compare each item
      for (let i = 0; i < prevObj.length; i++) {
        if (prevObj[i] !== nextObj[i]) return true;
      }
      
      return false;
    }
    
    // For objects, we need deep comparison
    if (
      typeof prevObj === 'object' && 
      prevObj !== null && 
      typeof nextObj === 'object' && 
      nextObj !== null
    ) {
      const prevKeys = Object.keys(prevObj);
      const nextKeys = Object.keys(nextObj);
      
      if (prevKeys.length !== nextKeys.length) return true;
      
      // Check if any key has changed
      for (const key of prevKeys) {
        if (prevObj[key] !== nextObj[key]) return true;
      }
      
      return false;
    }
    
    // For primitives, just compare
    return prevObj !== nextObj;
  }, []);
  
  // Log info about renders in development
  const logRender = useCallback((props: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Render] ${componentName} rendered ${renderCount.current} times`, props);
    }
  }, [componentName]);
  
  return {
    renderCount: renderCount.current,
    hasChanged,
    logRender
  };
};
