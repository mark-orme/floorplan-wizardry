import React, { useState, useEffect } from 'react';
import { EmergencyCanvas } from '@/components/EmergencyCanvas';
import { useCanvasErrorHandling } from '@/hooks/useCanvasErrorHandling';
import { DebugInfoState } from '@/types/debugTypes';
import { resetInitializationState } from '@/utils/canvas/safeCanvasInitialization';
import logger from '@/utils/logger';

interface EmergencyCanvasProviderProps {
  children: React.ReactNode;
  errorState: boolean;
  errorMessage: string;
  debugInfo: DebugInfoState;
  onRetry?: () => void;
  width?: number;
  height?: number;
}

/**
 * EmergencyCanvasProvider component
 * Provides fallback rendering when canvas initialization fails
 */
export const EmergencyCanvasProvider: React.FC<EmergencyCanvasProviderProps> = ({
  children,
  errorState,
  errorMessage,
  debugInfo,
  onRetry,
  width = 800,
  height = 600
}) => {
  const [shouldShowEmergency, setShouldShowEmergency] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [forceDisableRetry, setForceDisableRetry] = useState(false);
  
  // Set up the diagnostic data to pass to emergency canvas
  const diagnosticData = {
    errorMessage,
    debugInfo,
    initTime: debugInfo.lastInitTime,
    retryAttempts,
    timestamp: new Date().toISOString(),
    canvasBlocked: retryAttempts >= 3
  };
  
  // Track error state changes
  useEffect(() => {
    // If we get an error, wait a short time before showing emergency canvas
    // This prevents flashing of emergency canvas during normal initialization
    if (errorState) {
      const timer = setTimeout(() => {
        logger.warn("Showing emergency canvas due to canvas error");
        setShouldShowEmergency(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShouldShowEmergency(false);
    }
  }, [errorState]);
  
  // Reset initialization state completely when this component mounts
  useEffect(() => {
    resetInitializationState();
  }, []);
  
  // Handle canvas retry
  const handleRetry = () => {
    if (retryAttempts >= 3) {
      setForceDisableRetry(true);
      logger.error("Too many retry attempts, blocking further retry attempts");
      return;
    }
    
    // Reset initialization state before retry
    resetInitializationState();
    
    // Increment retry counter
    setRetryAttempts(prev => prev + 1);
    
    // Hide emergency canvas immediately
    setShouldShowEmergency(false);
    
    // Call the provided retry handler
    if (onRetry) {
      onRetry();
    }
  };
  
  // If we should show emergency canvas, render it instead of children
  if (shouldShowEmergency) {
    return (
      <EmergencyCanvas
        onRetry={handleRetry}
        width={width}
        height={height}
        diagnosticData={diagnosticData}
        forceDisableRetry={forceDisableRetry}
      />
    );
  }
  
  // Otherwise, render children normally
  return <>{children}</>;
};
