
import React, { useState, useEffect } from 'react';
import { DebugInfoState, DEFAULT_DEBUG_STATE } from '@/types/core/DebugInfo';
import { EmergencyCanvasError } from './EmergencyCanvasError';

interface EmergencyCanvasProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  width?: number;
  height?: number;
  onError?: (error: Error) => void;
}

export const EmergencyCanvasProvider: React.FC<EmergencyCanvasProviderProps> = ({
  children,
  fallback,
  width = 800,
  height = 600,
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Use the default debug info with updated dimensions
  const debugInfo: DebugInfoState = {
    ...DEFAULT_DEBUG_STATE,
    canvasDimensions: { width, height },
    canvasInitialized: false,
    lastInitTime: Date.now()
  };
  
  const handleError = (error: Error) => {
    setHasError(true);
    setErrorMessage(error.message);
    
    if (onError) {
      onError(error);
    }
  };
  
  const handleRetry = () => {
    setRetryAttempts(prev => prev + 1);
    setHasError(false);
  };
  
  // Reset error state if children change
  useEffect(() => {
    setHasError(false);
  }, [children]);
  
  // Error boundary catch method
  const componentDidCatch = (error: Error) => {
    handleError(error);
  };
  
  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <EmergencyCanvasError
        onRetry={handleRetry}
        width={width}
        height={height}
        diagnosticData={{
          errorMessage,
          debugInfo,
          initTime: Date.now(),
          retryAttempts,
          timestamp: new Date().toISOString(),
          canvasBlocked: retryAttempts > 3
        }}
        forceDisableRetry={retryAttempts > 5}
      />
    );
  }
  
  return <>{children}</>;
};

export default EmergencyCanvasProvider;
