
/**
 * Hook for managing debug panel visibility
 * @module components/property/canvas/useDebugPanel
 */
import { useState, useEffect } from "react";

/**
 * Hook that manages debug panel visibility
 * Toggle with double-Escape key press
 * 
 * @returns Debug panel visibility state and toggle function
 */
export const useDebugPanel = () => {
  const [showDebug, setShowDebug] = useState(true); // Show debug panel by default
  
  // Toggle debug panel visibility with double Escape key
  useEffect(() => {
    let lastEscTime = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscTime < 500) {
          // Double Escape within 500ms
          setShowDebug(prev => !prev);
          lastEscTime = 0; // Reset
        } else {
          lastEscTime = now;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return {
    showDebug,
    setShowDebug
  };
};
