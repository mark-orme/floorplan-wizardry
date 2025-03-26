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
    errorMessage,
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set mounted flag on initial render
    componentMountedRef.current = true;
    
    // Log helpful debug info
    console.log('Canvas component mounted with debugInfo:', debugInfo);
    
    // Use requestAnimationFrame to wait for DOM to be fully rendered
    const checkCanvasReady = () => {
      if (!componentMountedRef.current) return;
      
      // Log the current status of the canvas element
      console.log("🧱 canvasRef.current:", canvasRef.current);
      if (canvasRef.current) {
        console.log("📐 Canvas size:", canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        console.log("📐 Canvas dimensions:", canvasRef.current.width, canvasRef.current.height);
      }
      
      // Only count as a failed attempt if the DOM has had enough time to render
      // and canvas is still not available or has zero dimensions
      if (!canvasRef.current || (canvasRef.current.offsetWidth === 0 && canvasRef.current.offsetHeight === 0)) {
        // If we're still in the initial render phase, wait a bit longer
        if (failedAttempts < 1) {
          console.log("Canvas not ready yet, waiting for next frame...");
          requestAnimationFrame(checkCanvasReady);
          return;
        }
        
        logger.warn("Canvas element not available or has zero dimensions after DOM render");
        if (componentMountedRef.current) {
          setFailedAttempts(prev => prev + 1);
        }
      } else {
        // Successfully found canvas element with dimensions
        logger.info("Canvas element found in DOM with dimensions", {
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
          domWidth: canvasRef.current.width,
          domHeight: canvasRef.current.height
        });
        
        // Reset failed attempts if we previously incremented them
        if (failedAttempts > 0 && componentMountedRef.current) {
          setFailedAttempts(0);
        }
      }
    };
    
    // Start checking with requestAnimationFrame to ensure DOM is rendered
    requestAnimationFrame(checkCanvasReady);
    
    return () => {
      componentMountedRef.current = false;
      
      // Clear any pending timers
      if (circuitBreakerTimerRef.current) {
        clearTimeout(circuitBreakerTimerRef.current);
        circuitBreakerTimerRef.current = null;
      }
    };
  }, [debugInfo, canvasRef, failedAttempts]);
  
  // HARD LIMIT: If we exceed this number of attempts, force emergency mode with no retries
  const MAX_TOLERATED_ATTEMPTS = 3; // Reduced from 50 to 3 to fail faster
  
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
            offsetWidth: canvasRef.current.offsetWidth,
            offsetHeight: canvasRef.current.offsetHeight,
            hasAttributes: canvasRef.current ? 
              Array.from(canvasRef.current.attributes).map(a => a.name) : 
              'No attributes'
          } : 'No canvas ref',
          errorStack: errorDetailsRef.current.slice(-5), // Keep last 5 errors
          errorMessage: errorMessage
        };
        
        if (componentMountedRef.current) {
          setDiagnosticData(diagnostics);
        }
        
        // Log to console for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Canvas initialization diagnostic data:', diagnostics);
        }
        
        // Check for severe initialization loop with a delay to ensure it's really failing
        if (failedAttempts > MAX_TOLERATED_ATTEMPTS) {
          // Give it one last chance with setTimeout to ensure DOM had time to render
          setTimeout(() => {
            if (!componentMountedRef.current) return;
            
            // Only trigger emergency mode if canvas is still not available after the delay
            if (!canvasRef.current || (canvasRef.current.offsetWidth === 0 && canvasRef.current.offsetHeight === 0)) {
              logger.error(`Canvas initialization failed after ${failedAttempts} attempts - emergency shutdown`);
              forceEmergencyRef.current = true;
              
              if (componentMountedRef.current) {
                setUseEmergencyCanvas(true);
                toast.error("Canvas initialization failed - switching to emergency mode", {
                  id: "canvas-emergency-mode",
                  duration: 4000
                });
              }
              
              // Report this critical case
              captureError(
                new Error(`Canvas initialization failed after ${failedAttempts} attempts`),
                'canvas-critical-failure',
                {
                  level: 'error',
                  extra: { diagnostics }
                }
              );
            }
          }, 500); // Give it 500ms to ensure DOM has rendered
        }
      } catch (e) {
        console.error('Error collecting diagnostic data:', e);
      }
    };
    
    // Collect diagnostics on mount and when error state changes
    collectDiagnosticInfo();
  }, [debugInfo, failedAttempts, canvasRef, hasError, MAX_TOLERATED_ATTEMPTS, errorMessage]);
  
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
      
      if (componentMountedRef.current) {
        setFailedAttempts(prev => {
          const newCount = prev + 1;
          
          // Add error details to help with debugging
          errorDetailsRef.current.push(`Error #${newCount} at ${new Date().toISOString()}: ${errorMessage || 'Unknown error'}`);
          
          // If we have more than 10 errors, trim the list
          if (errorDetailsRef.current.length > 10) {
            errorDetailsRef.current.shift();
          }
          
          logger.warn(`Canvas initialization failed (attempt ${newCount})`);
          
          // If we have 2+ errors in 2 seconds or 2+ total failures, switch to emergency canvas
          // But add a delay to make sure it's not just a transient issue
          if ((recentErrors.length >= 2 || newCount >= 2) && !useEmergencyCanvas) {
            logger.error('Multiple canvas failures detected, scheduling emergency canvas switch', {
              errorCount: newCount,
              recentErrors: recentErrors.length,
              errorDetails: errorDetailsRef.current.join('\n')
            });
            
            // Clear any pending circuit breaker timer
            if (circuitBreakerTimerRef.current) {
              clearTimeout(circuitBreakerTimerRef.current);
            }
            
            // Add a short delay before switching to emergency mode to give initialization another chance
            circuitBreakerTimerRef.current = setTimeout(() => {
              if (!componentMountedRef.current) return;
              
              // Double-check if canvas is still unavailable after the delay
              if (newCount >= 2 || forceEmergencyRef.current) {
                logger.error('Switching to emergency canvas after delay');
                
                // Switch to emergency canvas and notify user
                if (componentMountedRef.current) {
                  setUseEmergencyCanvas(true);
                  toast.error('Canvas initialization failed. Using emergency mode.', {
                    id: 'canvas-failure',
                    duration: 5000
                  });
                }
              }
            }, 800); // 800ms delay before emergency mode
          }
          
          return newCount;
        });
      }
    }
  }, [hasError, debugInfo, useEmergencyCanvas, errorMessage]);
  
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
    
    if (componentMountedRef.current) {
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
    }
  };
  
  // Use emergency canvas if too many failures or forced
  if (useEmergencyCanvas || (hasError && failedAttempts >= 2)) {
    return (
      <>
        <EmergencyCanvas 
          onRetry={handleEmergencyRetry} 
          diagnosticData={diagnosticData} 
          width={800}
          height={600}
          forceDisableRetry={forceEmergencyRef.current}
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
  
  // Otherwise use regular canvas - with the updated prop name
  return (
    <CanvasContainer 
      ref={containerRef} 
      debugInfo={debugInfo} 
      canvasElementRef={canvasRef} 
    />
  );
};
