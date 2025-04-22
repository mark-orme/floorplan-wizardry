import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsIOS } from '@/hooks/use-ios';
import { createBasicEmergencyGrid, setupGridVisibilityCheck } from '@/utils/gridCreationUtils';
import { enhanceGridForIOS } from '@/utils/grid/gridVisibilityManager';
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentry';
import logger from '@/utils/logger';

interface MobileGridLayerProps {
  canvas: FabricCanvas | null;
  visible?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * Specialized grid layer component optimized for mobile devices
 * Uses simpler grid pattern and more frequent visibility checks
 */
export const MobileGridLayer: React.FC<MobileGridLayerProps> = ({ 
  canvas, 
  visible = true,
  onGridCreated 
}) => {
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();
  const initialized = useRef(false);
  const [gridStatus, setGridStatus] = useState<{
    objectCount: number;
    visibleCount: number;
    lastCheckTime: number;
  }>({ objectCount: 0, visibleCount: 0, lastCheckTime: 0 });
  
  // Update Sentry context with component state
  useEffect(() => {
    Sentry.setContext("mobileGrid", {
      isMobile,
      isIOS,
      initialized: initialized.current,
      gridStatus,
      canvasAvailable: !!canvas,
      deviceInfo: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    
    return () => {
      // Clear context when component unmounts
      Sentry.setContext("mobileGrid", null);
    };
  }, [isMobile, isIOS, canvas, gridStatus]);
  
  useEffect(() => {
    if (!canvas || !isMobile || initialized.current) return;
    
    try {
      // Create initial grid
      logger.info("MobileGridLayer: Creating mobile-optimized grid", {
        isIOS,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      });
      
      // Capture creation start in Sentry
      const startTime = performance.now();
      captureMessage("Starting mobile grid creation", "mobile-grid-creation", {
        tags: { 
          isIOS: String(isIOS),
          isMobile: "true" 
        },
        extra: {
          canvasDimensions: `${canvas.width}x${canvas.height}`,
          devicePixelRatio: window.devicePixelRatio || 1
        }
      });
      
      const gridObjects = createBasicEmergencyGrid(canvas);
      initialized.current = true;
      
      const endTime = performance.now();
      const creationTime = endTime - startTime;
      
      // Update grid status
      setGridStatus({
        objectCount: gridObjects.length,
        visibleCount: gridObjects.filter(obj => obj.visible).length,
        lastCheckTime: Date.now()
      });
      
      // Report successful grid creation
      captureMessage(
        `Mobile grid created: ${gridObjects.length} objects in ${creationTime.toFixed(1)}ms`,
        "mobile-grid-created",
        {
          level: 'info',
          tags: { component: "MobileGridLayer" },
          extra: {
            objectCount: gridObjects.length,
            creationTimeMs: creationTime,
            isGridVisible: gridObjects.some(obj => obj.visible),
            gridObjectIds: gridObjects.map(obj => obj.id || 'unknown'),
            timestamp: new Date().toISOString()
          }
        }
      );
      
      if (onGridCreated) {
        onGridCreated(gridObjects);
      }
      
      // Apply iOS-specific enhancements
      if (isIOS) {
        logger.info("Applying iOS-specific grid enhancements");
        enhanceGridForIOS(canvas);
        
        // Force multiple renders on iOS to ensure visibility
        let renderCount = 0;
        const forceRenders = setInterval(() => {
          if (canvas && renderCount < 5) {
            canvas.requestRenderAll();
            renderCount++;
          } else {
            clearInterval(forceRenders);
            
            // Check grid visibility after forced renders
            const visibleGridCount = gridObjects.filter(obj => obj.visible).length;
            
            captureMessage(
              `iOS grid visibility after forced renders: ${visibleGridCount}/${gridObjects.length}`,
              "ios-grid-visibility-check",
              {
                level: visibleGridCount === 0 ? 'warning' : 'info',
                tags: {
                  visibilityStatus: visibleGridCount > 0 ? 'visible' : 'invisible',
                  renderCount: String(renderCount)
                }
              }
            );
          }
        }, 300);
      }
      
      // Set up more frequent visibility checks for mobile
      const cleanupCheck = setupGridVisibilityCheck(canvas, 3000);
      
      // Periodic grid status checks
      const statusInterval = setInterval(() => {
        if (!canvas) return;
        
        try {
          const currentGridObjects = canvas.getObjects().filter(obj => 
            (obj as any).isGrid === true || (obj as any).objectType === 'grid'
          );
          
          const visibleGridObjects = currentGridObjects.filter(obj => obj.visible);
          
          // Update grid status
          setGridStatus({
            objectCount: currentGridObjects.length,
            visibleCount: visibleGridObjects.length,
            lastCheckTime: Date.now()
          });
          
          // Report if grid is missing or invisible
          if (currentGridObjects.length === 0) {
            captureMessage("Mobile grid objects missing", "grid-missing", {
              level: 'warning',
              tags: {
                isIOS: String(isIOS),
                wasInitialized: String(initialized.current)
              }
            });
            
            // Try to recreate grid if missing
            if (initialized.current) {
              logger.warn("Grid objects missing - attempting recreation");
              const newGridObjects = createBasicEmergencyGrid(canvas);
              
              captureMessage(
                `Emergency grid recreation: ${newGridObjects.length} objects created`,
                "grid-recreation",
                {
                  tags: { 
                    isIOS: String(isIOS),
                    success: String(newGridObjects.length > 0)
                  }
                }
              );
            }
          } else if (visibleGridObjects.length === 0) {
            captureMessage("Mobile grid objects invisible", "grid-invisible", {
              level: 'warning',
              tags: {
                isIOS: String(isIOS),
                totalObjects: String(currentGridObjects.length)
              },
              extra: {
                gridObjectProperties: currentGridObjects.map(obj => ({
                  id: obj.id,
                  visible: obj.visible,
                  opacity: obj.opacity,
                  type: obj.type
                }))
              }
            });
            
            // Force visibility on all grid objects
            currentGridObjects.forEach(obj => {
              obj.set('visible', true);
              obj.set('opacity', 1);
            });
            canvas.requestRenderAll();
          }
        } catch (error) {
          captureError(error, "grid-status-check-error");
        }
      }, 5000);
      
      // Force additional renders to ensure grid visibility on iOS
      const renderInterval = setInterval(() => {
        if (canvas && isIOS) {
          canvas.requestRenderAll();
        }
      }, 1000);
      
      // Cleanup on unmount
      return () => {
        cleanupCheck();
        clearInterval(statusInterval);
        clearInterval(renderInterval);
        
        // Remove grid objects if they exist
        if (canvas) {
          gridObjects.forEach(obj => {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          });
          canvas.requestRenderAll();
        }
        
        captureMessage("Mobile grid layer unmounted", "mobile-grid-unmount", {
          tags: {
            isIOS: String(isIOS),
            isMobile: "true"
          }
        });
      };
    } catch (error) {
      // Capture critical errors in grid creation
      captureError(error, "mobile-grid-creation-error", {
        level: 'error',
        tags: {
          isIOS: String(isIOS),
          isMobile: "true"
        },
        extra: {
          canvasDimensions: canvas ? `${canvas.width}x${canvas.height}` : 'unknown',
          initialized: initialized.current
        }
      });
      
      logger.error("Error creating mobile grid:", error);
      return () => {}; // Empty cleanup function
    }
  }, [canvas, isMobile, isIOS, onGridCreated]);
  
  // Update grid visibility when it changes
  useEffect(() => {
    if (!canvas) return;
    
    try {
      logger.info(`Setting grid visibility: ${visible}`);
      
      const gridObjects = canvas.getObjects().filter(obj => 
        (obj as any).isGrid === true || (obj as any).objectType === 'grid'
      );
      
      if (gridObjects.length === 0) {
        captureMessage("No grid objects found when updating visibility", "grid-visibility-update", {
          level: 'warning',
          tags: {
            isIOS: String(isIOS),
            targetVisibility: String(visible)
          }
        });
        return;
      }
      
      gridObjects.forEach(obj => {
        obj.set('visible', visible);
      });
      
      canvas.requestRenderAll();
      
      // Update grid status after visibility change
      setGridStatus(prev => ({
        ...prev,
        visibleCount: visible ? prev.objectCount : 0,
        lastCheckTime: Date.now()
      }));
      
      captureMessage(`Grid visibility set to ${visible}`, "grid-visibility-changed", {
        level: 'info',
        tags: { component: "MobileGridLayer" },
        extra: { visible: visible }
      });
    } catch (error) {
      captureError(error, "grid-visibility-update-error");
      logger.error("Error updating grid visibility:", error);
    }
  }, [canvas, visible, isIOS]);
  
  // This is a controller component, no visible elements
  return null;
};

export default MobileGridLayer;
