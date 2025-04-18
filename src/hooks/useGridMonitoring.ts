
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import * as Sentry from '@sentry/react';
import { captureMessage } from '@/utils/sentry';
import { useIsIOS } from './use-ios';
import logger from '@/utils/logger';

/**
 * Hook to monitor grid visibility and health
 * Provides diagnostics and recovery for grid display issues
 */
export function useGridMonitoring(
  canvas: FabricCanvas | null,
  isGridVisible: boolean = true
) {
  const isIOS = useIsIOS();
  const monitoringInterval = useRef<number | null>(null);
  const recoveryAttempts = useRef<number>(0);
  const lastCheckTime = useRef<number>(Date.now());
  
  // Set up grid monitoring
  useEffect(() => {
    if (!canvas) return;
    
    // Create transaction for monitoring setup
    const setupTransaction = Sentry.startTransaction({
      name: 'grid.monitoring.setup',
      op: 'setup'
    });
    
    try {
      logger.info('Setting up grid monitoring');
      
      // Set diagnostic context in Sentry
      Sentry.setContext('gridMonitoring', {
        isGridVisible,
        isIOS,
        canvasDimensions: canvas ? `${canvas.width}x${canvas.height}` : 'unknown',
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      // Monitor grid health periodically
      const checkGridHealth = () => {
        if (!canvas) return;
        
        const currentTime = Date.now();
        const timeSinceLastCheck = currentTime - lastCheckTime.current;
        lastCheckTime.current = currentTime;
        
        try {
          // Find grid objects
          const gridObjects = canvas.getObjects().filter(obj => 
            (obj as any).isGrid === true || (obj as any).objectType === 'grid'
          );
          
          const visibleGridCount = gridObjects.filter(obj => obj.visible).length;
          const expectedVisible = isGridVisible ? gridObjects.length : 0;
          
          // Check for issues
          const hasIssues = (isGridVisible && visibleGridCount === 0) || 
                           (!isGridVisible && visibleGridCount > 0) ||
                           gridObjects.length === 0;
          
          // Log monitoring data
          logger.debug('Grid health check', {
            gridObjectCount: gridObjects.length,
            visibleGridCount,
            isGridVisible,
            hasIssues,
            timeSinceLastCheck
          });
          
          // Report significant issues
          if (hasIssues) {
            recoveryAttempts.current++;
            
            captureMessage(`Grid health issue: Attempt ${recoveryAttempts.current}`, 'grid-health-issue', {
              level: recoveryAttempts.current > 3 ? 'warning' : 'info',
              tags: {
                isIOS: String(isIOS),
                gridObjectCount: String(gridObjects.length),
                visibleGridCount: String(visibleGridCount),
                expectedVisible: String(expectedVisible),
                recoveryAttempts: String(recoveryAttempts.current)
              },
              extra: {
                canvasDimensions: `${canvas.width}x${canvas.height}`,
                canvasObjects: canvas.getObjects().length,
                devicePixelRatio: window.devicePixelRatio || 1,
                screenSize: `${window.innerWidth}x${window.innerHeight}`
              }
            });
            
            // Try emergency recovery if multiple issues detected
            if (recoveryAttempts.current >= 3) {
              // Force grid objects to be visible
              gridObjects.forEach(obj => {
                obj.set('visible', isGridVisible);
                obj.set('opacity', 1);
                
                // Ensure no transforms are preventing visibility
                if (obj.setCoords) {
                  obj.setCoords();
                }
              });
              
              canvas.requestRenderAll();
              
              logger.warn('Applied emergency grid visibility fix', {
                recoveryAttempts: recoveryAttempts.current,
                objectsFixed: gridObjects.length
              });
            }
          } else {
            // Reset recovery attempts if grid is healthy
            if (recoveryAttempts.current > 0) {
              recoveryAttempts.current = 0;
            }
          }
        } catch (error) {
          Sentry.captureException(error);
          logger.error('Error in grid health check:', error);
        }
      };
      
      // Set up monitoring interval
      monitoringInterval.current = window.setInterval(checkGridHealth, isIOS ? 3000 : 5000);
      
      // Run initial check
      checkGridHealth();
      
      // Complete transaction
      setupTransaction.setStatus('ok');
      setupTransaction.finish();
    } catch (error) {
      // Handle setup errors
      setupTransaction.setStatus('error');
      setupTransaction.finish();
      Sentry.captureException(error);
      logger.error('Error setting up grid monitoring:', error);
    }
    
    // Clean up on unmount
    return () => {
      if (monitoringInterval.current !== null) {
        clearInterval(monitoringInterval.current);
        monitoringInterval.current = null;
      }
      
      // Clear context
      Sentry.setContext('gridMonitoring', null);
    };
  }, [canvas, isGridVisible, isIOS]);
  
  // Return manual trigger for diagnostics
  return {
    runGridDiagnostics: () => {
      if (!canvas) return false;
      
      try {
        const gridObjects = canvas.getObjects().filter(obj => 
          (obj as any).isGrid === true || (obj as any).objectType === 'grid'
        );
        
        captureMessage('Manual grid diagnostics', 'grid-diagnostics', {
          tags: {
            isIOS: String(isIOS),
            gridVisible: String(isGridVisible)
          },
          extra: {
            gridObjectCount: gridObjects.length,
            visibleGridCount: gridObjects.filter(obj => obj.visible).length,
            canvasDimensions: `${canvas.width}x${canvas.height}`,
            canvasObjects: canvas.getObjects().length,
            timestamp: new Date().toISOString()
          }
        });
        
        return true;
      } catch (error) {
        Sentry.captureException(error);
        return false;
      }
    }
  };
}
