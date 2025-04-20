
import { useState } from 'react';

export const useDebugPanel = () => {
  const [showDebug, setShowDebug] = useState(false);
  
  return {
    showDebug,
    setShowDebug
  };
};
