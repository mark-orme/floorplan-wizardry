import React, { useState, useEffect } from 'react';
import { CanvasContainer } from './CanvasContainer';
import { useCanvasController } from './canvas/controller/CanvasController';
import { EmergencyCanvas } from './EmergencyCanvas';
import logger from '@/utils/logger';

/**
 * Main Canvas component that uses CanvasContainer
 * Includes fallback to EmergencyCanvas when main canvas fails
 */
export const Canvas: React.FC = () => {
  const { 
    canvasRef, 
    debugInfo, 
    hasError, 
    handleRetry
  } = useCanvasController();
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [useEmergencyCanvas, setUseEmergencyCanvas] = useState(false);
  
  // Track errors and switch to emergency canvas after too many failures
  useEffect(() => {
    if (hasError) {
      setFailedAttempts(prev => {
        const newCount = prev + 1;
        logger.warn(`Canvas initialization failed (attempt ${newCount})`);
        
        // After 3 failed attempts, switch to emergency canvas
        if (newCount >= 3) {
          logger.error('Too many canvas failures, switching to emergency canvas');
          setUseEmergencyCanvas(true);
        }
        
        return newCount;
      });
    }
  }, [hasError]);
  
  // Handle retry from emergency canvas
  const handleEmergencyRetry = () => {
    setFailedAttempts(0);
    setUseEmergencyCanvas(false);
    handleRetry();
  };
  
  // Use emergency canvas if too many failures
  if (useEmergencyCanvas) {
    return <EmergencyCanvas onRetry={handleEmergencyRetry} />;
  }
  
  // Otherwise use regular canvas
  return <CanvasContainer debugInfo={debugInfo} canvasRef={canvasRef} />;
};
