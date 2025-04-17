
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to track keyboard modifier keys (Shift, Alt, Ctrl, etc.)
 */
export const useKeyboardModifiers = () => {
  const [shiftKey, setShiftKey] = useState(false);
  const [altKey, setAltKey] = useState(false);
  const [ctrlKey, setCtrlKey] = useState(false);
  const [metaKey, setMetaKey] = useState(false);
  
  // Handler for keydown events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setShiftKey(e.shiftKey);
    setAltKey(e.altKey);
    setCtrlKey(e.ctrlKey);
    setMetaKey(e.metaKey);
  }, []);
  
  // Handler for keyup events
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setShiftKey(e.shiftKey);
    setAltKey(e.altKey);
    setCtrlKey(e.ctrlKey);
    setMetaKey(e.metaKey);
  }, []);
  
  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  
  return {
    shiftKey,
    altKey,
    ctrlKey,
    metaKey,
    // Helper for Figma-style modifiers
    modifiers: {
      shift: shiftKey,
      alt: altKey,
      ctrl: ctrlKey,
      meta: metaKey
    }
  };
};
