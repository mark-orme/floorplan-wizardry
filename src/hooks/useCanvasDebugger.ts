
/**
 * Canvas Debugger Hook
 * Provides comprehensive debugging tools for canvas and grid issues
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';
import logger from '@/utils/logger';
import { setupCanvasMonitoring } from '@/utils/sentry/canvasMonitoring';

interface UseCanvasDebuggerProps {
  canvas: FabricCanvas | null;
  gridLayerRef: React.MutableRefObject<any[]>;
  enabled?: boolean;
}

export function useCanvasDebugger({
  canvas,
  gridLayerRef,
  enabled = true
}: UseCanvasDebuggerProps) {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [canvasStats, setCanvasStats] = useState<any>(null);
  const monitoringCleanupRef = useRef<(() => void) | null>(null);
  
  // Set up canvas monitoring with Sentry when enabled
  useEffect(() => {
    if (!enabled || !canvas) return;
    
    // Set up canvas and grid monitoring
    const cleanup = setupCanvasMonitoring(canvas, gridLayerRef);
    monitoringCleanupRef.current = cleanup;
    
    // Log initial canvas state
    logger.info('Canvas debugger initialized', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      objectCount: canvas.getObjects().length,
      gridObjects: gridLayerRef.current.length
    });
    
    // Add canvas debugging info to global scope for console debugging
    if (typeof window !== 'undefined') {
      (window as any).__canvas_debug = {
        isDebugMode: true,
        canvas,
        gridLayer: gridLayerRef.current,
        dumpState: () => dumpCanvasState()
      };
      
      console.log('Canvas debugger initialized. Access via window.__canvas_debug');
    }
    
    return () => {
      if (monitoringCleanupRef.current) {
        monitoringCleanupRef.current();
        monitoringCleanupRef.current = null;
      }
      
      if (typeof window !== 'undefined') {
        delete (window as any).__canvas_debug;
      }
    };
  }, [canvas, enabled, gridLayerRef]);
  
  // Function to dump the canvas state
  const dumpCanvasState = useCallback(() => {
    if (!canvas) {
      console.error('Canvas not available for debugging');
      return null;
    }
    
    try {
      const allObjects = canvas.getObjects();
      const gridObjects = gridLayerRef.current;
      
      // Calculate grid visibility stats
      const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
      const visibleGridObjects = gridOnCanvas.filter(obj => obj.visible);
      
      // Build detailed canvas stats
      const stats = {
        timestamp: new Date().toISOString(),
        canvas: {
          width: canvas.width,
          height: canvas.height,
          zoom: canvas.getZoom(),
          viewportTransform: canvas.viewportTransform,
          renderOnAddRemove: canvas.renderOnAddRemove,
          objectCaching: canvas.objectCaching,
          backgroundColor: canvas.backgroundColor
        },
        objects: {
          total: allObjects.length,
          byType: Object.fromEntries(
            Object.entries(
              allObjects.reduce((acc: any, obj) => {
                const type = obj.type || 'unknown';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              }, {})
            )
          ),
          visible: allObjects.filter(obj => obj.visible).length,
          invisible: allObjects.filter(obj => !obj.visible).length
        },
        grid: {
          total: gridObjects.length,
          onCanvas: gridOnCanvas.length,
          notOnCanvas: gridObjects.length - gridOnCanvas.length,
          visible: visibleGridObjects.length,
          invisible: gridOnCanvas.length - visibleGridObjects.length,
        },
        history: {
          renderCount: canvas._renderCounter || 0
        }
      };
      
      // Update state with stats
      setCanvasStats(stats);
      
      // Log stats to console
      console.log('Canvas Debug - Current State:', stats);
      logger.info('Canvas debug stats generated', {
        width: stats.canvas.width,
        height: stats.canvas.height,
        totalObjects: stats.objects.total,
        gridObjects: stats.grid.total,
        visibleGrid: stats.grid.visible
      });
      
      return stats;
    } catch (error) {
      console.error('Error generating canvas debug stats:', error);
      logger.error('Error generating canvas debug stats', { error });
      return null;
    }
  }, [canvas, gridLayerRef]);
  
  // Function to force render the canvas
  const forceRender = useCallback(() => {
    if (!canvas) return;
    
    try {
      logger.info('Force rendering canvas');
      console.log('Canvas Debug - Force rendering canvas');
      
      // Force multiple renders with timeouts to ensure complete rendering
      canvas.requestRenderAll();
      
      setTimeout(() => {
        canvas.requestRenderAll();
        
        setTimeout(() => {
          canvas.requestRenderAll();
          logger.info('Force render complete');
        }, 100);
      }, 50);
      
      toast.success('Canvas forced to re-render');
    } catch (error) {
      console.error('Error force rendering canvas:', error);
      logger.error('Error force rendering canvas', { error });
      toast.error('Error forcing canvas render');
    }
  }, [canvas]);
  
  // Function to force grid visibility
  const forceGridVisibility = useCallback(() => {
    if (!canvas) return;
    
    try {
      logger.info('Force fixing grid visibility');
      console.log('Canvas Debug - Force fixing grid visibility');
      
      const gridObjects = gridLayerRef.current;
      let fixedCount = 0;
      
      // Add missing grid objects
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
          canvas.sendToBack(obj);
          fixedCount++;
        }
        
        // Make sure it's visible
        if (!obj.visible) {
          obj.set('visible', true);
          fixedCount++;
        }
      });
      
      // Force render
      canvas.requestRenderAll();
      
      // Report results
      if (fixedCount > 0) {
        toast.success(`Fixed ${fixedCount} grid visibility issues`);
        logger.info(`Fixed ${fixedCount} grid visibility issues`);
        
        // Report to Sentry
        Sentry.captureMessage(`Fixed ${fixedCount} grid visibility issues`, {
          level: 'info',
          tags: {
            component: 'canvasDebugger',
            action: 'forceGridVisibility'
          }
        });
      } else {
        toast.info('No grid visibility issues found');
      }
      
      // Force another render after a delay
      setTimeout(() => {
        canvas.requestRenderAll();
      }, 100);
      
      return fixedCount;
    } catch (error) {
      console.error('Error fixing grid visibility:', error);
      logger.error('Error fixing grid visibility', { error });
      toast.error('Error fixing grid visibility');
      
      return 0;
    }
  }, [canvas, gridLayerRef]);
  
  // Function to recreate grid
  const recreateGrid = useCallback((gridCreator: () => any[]) => {
    if (!canvas) return;
    
    try {
      logger.info('Recreating grid');
      console.log('Canvas Debug - Recreating grid');
      
      // Remove existing grid objects
      const existingGrid = gridLayerRef.current;
      existingGrid.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Create new grid
      const newGrid = gridCreator();
      
      // Update grid reference
      gridLayerRef.current = newGrid;
      
      // Make grid visible
      newGrid.forEach(obj => {
        obj.set('visible', true);
        canvas.sendToBack(obj);
      });
      
      // Force render
      canvas.requestRenderAll();
      
      toast.success(`Grid recreated with ${newGrid.length} objects`);
      logger.info(`Grid recreated with ${newGrid.length} objects`);
      
      // Force another render after a delay
      setTimeout(() => {
        canvas.requestRenderAll();
      }, 100);
      
      return newGrid.length;
    } catch (error) {
      console.error('Error recreating grid:', error);
      logger.error('Error recreating grid', { error });
      toast.error('Error recreating grid');
      
      return 0;
    }
  }, [canvas, gridLayerRef]);
  
  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        // Generate stats when enabling
        dumpCanvasState();
      }
      
      logger.info(`Canvas debugger ${newMode ? 'enabled' : 'disabled'}`);
      return newMode;
    });
  }, [dumpCanvasState]);
  
  return {
    isDebugMode,
    canvasStats,
    dumpCanvasState,
    forceRender,
    forceGridVisibility,
    recreateGrid,
    toggleDebugMode
  };
}
