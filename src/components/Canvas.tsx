
import React, { useState, useEffect, useRef } from 'react';
import { CanvasContainer } from './CanvasContainer';
import { useCanvasController } from './canvas/controller/CanvasController';
import { EmergencyCanvas } from './EmergencyCanvas';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';

/**
 * Main Canvas component that uses CanvasContainer
 * Includes fallback to EmergencyCanvas when main canvas fails
 */
export const Canvas: React.FC = () => {
  // Get canvas controller values
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
  const errorDetailsRef = useRef<string[]>([]);
  const [diagnosticData, setDiagnosticData] = useState<Record<string, any>>({});
  const forceEmergencyRef = useRef<boolean>(false);
  const componentMountedRef = useRef<boolean>(false);
  
  // Set mounted flag on initial render
  useEffect(() => {
    componentMountedRef.current = true;
    
    return () => {
      componentMountedRef.current = false;
    };
  }, []);
  
  // Collect diagnostic data to help debug initialization issues
  useEffect(() => {
    if (!componentMountedRef.current) return;
    
    const collectDiagnosticInfo = () => {
      try {
        const diagnostics: Record<string, any> = {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          devicePixelRatio: window.devicePixelRatio,
          viewportSize: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          debugInfo: debugInfo,
          failedAttempts: failedAttempts,
          canvas: canvasRef.current ? {
            id: canvasRef.current.id,
            width: canvasRef.current.width,
            height: canvasRef.current.height,
            hasAttributes: canvasRef.current ? 
              Array.from(canvasRef.current.attributes).map(a => a.name) : 
              'No attributes'
          } : 'No canvas ref',
          errorStack: errorDetailsRef.current.slice(-5) // Keep last 5 errors
        };
        
        if (componentMountedRef.current) {
          setDiagnosticData(diagnostics);
        }
        
        // Log to console and Sentry for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Canvas initialization diagnostic data:', diagnostics);
        }
        
        if (failedAttempts > 1) {
          captureError(
            new Error(`Canvas initialization loop detected (${failedAttempts} attempts)`),
            'canvas-initialization-loop',
            {
              level: 'warning',
              extra: diagnostics
            }
          );
        }
      } catch (e) {
        console.error('Error collecting diagnostic data:', e);
      }
    };
    
    // Collect diagnostics on mount and when error state changes
    collectDiagnosticInfo();
  }, [debugInfo, failedAttempts, canvasRef, hasError]);
  
  // Force emergency canvas on special error case
  useEffect(() => {
    if (!componentMountedRef.current) return;
    
    if (hasError) {
      const errorMsg = errorDetailsRef.current[errorDetailsRef.current.length - 1] || '';
      // Check for special error message that indicates we need to use emergency canvas
      if (errorMsg.includes('Canvas initialization failed after multiple attempts') ||
          errorMsg.includes('blocked after') ||
          errorMsg.includes('Too many canvas initialization attempts')) {
        logger.warn('Initialization blocked, forcing emergency canvas');
        forceEmergencyRef.current = true;
        
        if (componentMountedRef.current) {
          setUseEmergencyCanvas(true);
        }
        
        // Report this specific case
        captureError(
          new Error('Canvas initialization blocked, forcing emergency mode'),
          'canvas-forced-emergency',
          {
            level: 'warning',
            extra: { diagnosticData, errorHistory: errorDetailsRef.current }
          }
        );
      }
    }
  }, [hasError, diagnosticData]);
  
  // Track errors and switch to emergency canvas after too many failures
  useEffect(() => {
    if (!componentMountedRef.current) return;
    
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
        
        // Add error details to help with debugging
        errorDetailsRef.current.push(`Error #${newCount} at ${new Date().toISOString()}: Canvas state - ${JSON.stringify({
          ready: debugInfo.canvasReady,
          dimensions: `${debugInfo.canvasWidth}x${debugInfo.canvasHeight}`,
          gridCreated: debugInfo.gridCreated
        })}`);
        
        // If we have more than 10 errors, trim the list
        if (errorDetailsRef.current.length > 10) {
          errorDetailsRef.current.shift();
        }
        
        logger.warn(`Canvas initialization failed (attempt ${newCount})`);
        
        // If we have 3+ errors in 2 seconds or 2+ total failures, switch to emergency canvas
        if (recentErrors.length >= 2 || newCount >= 2 || forceEmergencyRef.current) {
          logger.error('Too many canvas failures, switching to emergency canvas', {
            errorCount: newCount,
            recentErrors: recentErrors.length,
            errorDetails: errorDetailsRef.current.join('\n')
          });
          
          // Report critical error to Sentry with diagnostic data
          captureError(
            new Error(`Canvas initialization failed after ${newCount} attempts`),
            'canvas-initialization-critical',
            {
              level: 'error',
              extra: {
                diagnosticData,
                errorHistory: errorDetailsRef.current,
                timestamps: attemptTimestampsRef.current
              }
            }
          );
          
          // Clear any pending circuit breaker timer
          if (circuitBreakerTimerRef.current) {
            clearTimeout(circuitBreakerTimerRef.current);
          }
          
          // Switch to emergency canvas and notify user
          if (componentMountedRef.current) {
            setUseEmergencyCanvas(true);
            toast.error('Canvas initialization failed. Using emergency mode.', {
              id: 'canvas-failure',
              duration: 5000
            });
          }
        }
        
        return newCount;
      });
    }
  }, [hasError, debugInfo, diagnosticData]);
  
  // Set a circuit breaker to automatically try again after 30 seconds
  useEffect(() => {
    if (!componentMountedRef.current) return;
    
    if (useEmergencyCanvas && !forceEmergencyRef.current) {
      // Clear any existing timer
      if (circuitBreakerTimerRef.current) {
        clearTimeout(circuitBreakerTimerRef.current);
      }
      
      // Set timer to automatically retry after 30 seconds
      circuitBreakerTimerRef.current = setTimeout(() => {
        const timeSinceLastError = Date.now() - lastErrorTimeRef.current;
        
        // Only auto-retry if it's been at least 30 seconds since the last error
        if (timeSinceLastError > 30000 && componentMountedRef.current) {
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
    // If we specifically detected a blocking condition, don't allow retries
    if (forceEmergencyRef.current) {
      toast.info('Canvas initialization is blocked. Please refresh the page to try again.', {
        duration: 5000
      });
      return;
    }
    
    logger.info('Manual retry requested from emergency canvas');
    attemptTimestampsRef.current = []; // Clear error history
    errorDetailsRef.current = []; // Clear error details
    setFailedAttempts(0);
    setUseEmergencyCanvas(false);
    
    // Apply timeout to make sure React has time to unmount and clean up
    setTimeout(() => {
      if (componentMountedRef.current) {
        handleRetry();
        toast.info('Attempting to initialize main canvas...', {
          id: 'canvas-retry',
          duration: 3000
        });
      }
    }, 500);
  };
  
  // Use emergency canvas if too many failures
  if (useEmergencyCanvas) {
    return (
      <>
        <EmergencyCanvas 
          onRetry={handleEmergencyRetry} 
          diagnosticData={diagnosticData} 
          width={800}
          height={600}
        />
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-xs font-mono max-h-40 overflow-auto">
            <h3 className="font-bold text-red-700 mb-2">Debug Information:</h3>
            <pre>{JSON.stringify(diagnosticData, null, 2)}</pre>
          </div>
        )}
      </>
    );
  }
  
  // Otherwise use regular canvas
  return <CanvasContainer debugInfo={debugInfo} canvasRef={canvasRef} />;
};
