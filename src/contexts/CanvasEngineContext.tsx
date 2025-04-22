
import React, { createContext, useContext, useState } from 'react';

interface CanvasEngineContextType {
  isInitialized: boolean;
  isReady: boolean;
  error: Error | null;
  initialize: () => void;
  reset: () => void;
}

const CanvasEngineContext = createContext<CanvasEngineContextType | null>(null);

export const CanvasEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const initialize = () => {
    console.log('Initializing canvas engine...');
    setIsInitialized(true);
    
    setTimeout(() => {
      setIsReady(true);
      console.log('Canvas engine ready');
    }, 500);
  };
  
  const reset = () => {
    console.log('Resetting canvas engine...');
    setIsInitialized(false);
    setIsReady(false);
    setError(null);
  };
  
  return (
    <CanvasEngineContext.Provider value={{
      isInitialized,
      isReady,
      error,
      initialize,
      reset
    }}>
      {children}
    </CanvasEngineContext.Provider>
  );
};

export const useCanvasEngine = () => {
  const context = useContext(CanvasEngineContext);
  
  if (!context) {
    throw new Error('useCanvasEngine must be used within a CanvasEngineProvider');
  }
  
  return context;
};
