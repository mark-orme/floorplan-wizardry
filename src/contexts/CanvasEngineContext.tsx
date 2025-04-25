
import React, { createContext, useContext, useState } from 'react';

interface CanvasEngineState {
  isInitialized: boolean;
  isReady: boolean;
  isCollaborationEnabled: boolean;
}

interface CanvasEngineContextType {
  state: CanvasEngineState;
  initialize: () => Promise<void>;
  enableCollaboration: () => void;
  disableCollaboration: () => void;
}

const initialState: CanvasEngineState = {
  isInitialized: false,
  isReady: false,
  isCollaborationEnabled: false
};

const CanvasEngineContext = createContext<CanvasEngineContextType | undefined>(undefined);

export const CanvasEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CanvasEngineState>(initialState);

  const initialize = async () => {
    try {
      // Simulation of engine initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      setState(prev => ({ ...prev, isInitialized: true, isReady: true }));
    } catch (error) {
      console.error('Failed to initialize canvas engine:', error);
    }
  };

  const enableCollaboration = () => {
    setState(prev => ({ ...prev, isCollaborationEnabled: true }));
  };

  const disableCollaboration = () => {
    setState(prev => ({ ...prev, isCollaborationEnabled: false }));
  };

  return (
    <CanvasEngineContext.Provider
      value={{
        state,
        initialize,
        enableCollaboration,
        disableCollaboration
      }}
    >
      {children}
    </CanvasEngineContext.Provider>
  );
};

export const useCanvasEngine = (): CanvasEngineContextType => {
  const context = useContext(CanvasEngineContext);
  if (context === undefined) {
    throw new Error('useCanvasEngine must be used within a CanvasEngineProvider');
  }
  return context;
};
