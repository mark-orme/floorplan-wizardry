import React, { useState, useEffect, useRef } from 'react';
import { CanvasContainer } from './CanvasContainer';
import { useCanvasController } from './canvas/controller/CanvasController';
import { EmergencyCanvas } from './EmergencyCanvas';
import logger from '@/utils/logger';
import { toast } from 'sonner';

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
  
  // Track initialization attempts
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [useEmergencyCanvas, setUseEmergencyCanvas] = useState(false);
  const attemptTimestampsRef = useRef<number[]>([]);
  const lastErrorTimeRef = useRef<number>(0);
  const circuitBreakerTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track errors and switch to emergency canvas after too many failures
  useEffect(() => {
    if (hasError) {
      const now = Date.now();
      lastErrorTimeRef.current = now;
      
      // Track timestamps of errors to detect rapid loops
      attemptTimestampsRef.current.push(now);
      
      // Only keep the last 5 timestamps
      if (attemptTimestampsRef.current.length > 5) {
        attemptTimestampsRef.current.shift();
      }
      
      // Check for rapid error loops (more than 3 errors in 2 seconds)
      const twoSecondsAgo = now - 2000;
      const recentErrors = attemptTimestampsRef.current.filter(
        timestamp => timestamp > twoSecondsAgo
      );
      
      setFailedAttempts(prev => {
        const newCount = prev + 1;
        logger.warn(`Canvas initialization failed (attempt ${newCount})`);
        
        // If we have 3+ errors in 2 seconds or 3+ total failures, switch to emergency canvas
        if (recentErrors.length >= 3 || newCount >= 3) {
          logger.error('Too many canvas failures, switching to emergency canvas');
          
          // Clear any pending circuit breaker timer
          if (circuitBreakerTimerRef.current) {
            clearTimeout(circuitBreakerTimerRef.current);
          }
          
          // Switch to emergency canvas and notify user
          setUseEmergencyCanvas(true);
          toast.error('Canvas initialization failed. Using emergency mode.', {
            id: 'canvas-failure',
            duration: 5000
          });
        }
        
        return newCount;
      });
    }
  }, [hasError]);
  
  // Set a circuit breaker to automatically try again after 30 seconds
  useEffect(() => {
    if (useEmergencyCanvas) {
      // Clear any existing timer
      if (circuitBreakerTimerRef.current) {
        clearTimeout(circuitBreakerTimerRef.current);
      }
      
      // Set timer to automatically retry after 30 seconds
      circuitBreakerTimerRef.current = setTimeout(() => {
        const timeSinceLastError = Date.now() - lastErrorTimeRef.current;
        
        // Only auto-retry if it's been at least 30 seconds since the last error
        if (timeSinceLastError > 30000) {
          logger.info('Circuit breaker timer elapsed, automatically retrying main canvas');
          handleEmergencyRetry();
        }
      }, 30000);
    }
    
    return () => {
      if (circuitBreakerTimerRef.current) {
        clearTimeout(circuitBreakerTimerRef.current);
      }
    };
  }, [useEmergencyCanvas]);
  
  // Handle retry from emergency canvas
  const handleEmergencyRetry = () => {
    logger.info('Manual retry requested from emergency canvas');
    attemptTimestampsRef.current = []; // Clear error history
    setFailedAttempts(0);
    setUseEmergencyCanvas(false);
    
    // Apply timeout to make sure React has time to unmount and clean up
    setTimeout(() => {
      handleRetry();
      toast.info('Attempting to initialize main canvas...', {
        id: 'canvas-retry',
        duration: 3000
      });
    }, 500);
  };
  
  // Use emergency canvas if too many failures
  if (useEmergencyCanvas) {
    return <EmergencyCanvas onRetry={handleEmergencyRetry} />;
  }
  
  // Otherwise use regular canvas
  return <CanvasContainer debugInfo={debugInfo} canvasRef={canvasRef} />;
};
