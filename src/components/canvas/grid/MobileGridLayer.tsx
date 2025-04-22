import React, { useEffect, useState, useRef } from "react";
import { Canvas as FabricCanvas, Line, Point } from "fabric";
import { captureMessage, captureError } from "@/utils/sentryUtils";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

interface MobileGridLayerProps {
  canvas: FabricCanvas;
  gridSize?: number;
  gridColor?: string;
  opacity?: number;
  visible?: boolean;
  onGridCreated?: (objects: any[]) => void;
}

export const MobileGridLayer: React.FC<MobileGridLayerProps> = ({
  canvas,
  gridSize = GRID_CONSTANTS.DEFAULT_GRID_SIZE,
  gridColor = GRID_CONSTANTS.DEFAULT_GRID_COLOR,
  opacity = GRID_CONSTANTS.DEFAULT_GRID_OPACITY,
  visible = true,
  onGridCreated
}) => {
  const [gridObjects, setGridObjects] = useState<any[]>([]);
  const gridCreatedRef = useRef(false);
  
  // Create and manage the grid
  useEffect(() => {
    if (!canvas || gridCreatedRef.current) return;
    
    // Clear any existing grid lines
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    const newGridObjects: any[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    try {
      // Create vertical lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        const line = new Line([x, 0, x, canvasHeight], {
          stroke: gridColor,
          opacity: opacity,
          selectable: false,
          evented: false,
          visible,
          strokeWidth: 1
        });
        line.set('isGrid', true);
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Create horizontal lines
      for (let y = 0; y <= canvasHeight; y += gridSize) {
        const line = new Line([0, y, canvasWidth, y], {
          stroke: gridColor,
          opacity: opacity,
          selectable: false,
          evented: false,
          visible,
          strokeWidth: 1
        });
        line.set('isGrid', true);
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Log successful grid creation
      logger.info(`Mobile grid created with ${newGridObjects.length} lines`);
      captureMessage("Mobile grid created successfully", {
        level: 'info',
        tags: { component: 'MobileGridLayer' },
        extra: { 
          gridSize,
          lineCount: newGridObjects.length
        }
      });
      
      // Update the state
      setGridObjects(newGridObjects);
      
      // Mark as created
      gridCreatedRef.current = true;
      
      // Notify parent component
      if (onGridCreated) {
        onGridCreated(newGridObjects);
      }
      
      canvas.renderAll();
    } catch (error) {
      logger.error("Failed to create mobile grid:", error);
      captureError(error, {
        tags: { component: 'MobileGridLayer' },
        extra: { gridSize, color, opacity }
      });
    }
    
    // Clean up function
    return () => {
      try {
        newGridObjects.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        canvas.renderAll();
      } catch (err) {
        logger.error("Error cleaning up mobile grid:", err);
        captureError(err, {
          tags: { component: 'MobileGridLayer' },
          extra: { action: 'cleanup' }
        });
      }
    };
  }, [canvas, gridSize, gridColor, opacity]);
  
  // Update grid visibility when the visible prop changes
  useEffect(() => {
    if (!canvas || gridObjects.length === 0) return;
    
    try {
      gridObjects.forEach(obj => {
        obj.set('visible', visible);
      });
      
      captureMessage("Mobile grid visibility updated", {
        level: 'info',
        tags: { component: 'MobileGridLayer' },
        extra: { visible, gridObjectCount: gridObjects.length }
      });
      
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error updating grid visibility:", error);
      captureError(error, {
        tags: { component: 'MobileGridLayer' },
        extra: { action: 'updateVisibility' }
      });
    }
  }, [canvas, visible, gridObjects]);
  
  // Monitor and fix grid if it becomes compromised
  useEffect(() => {
    if (!canvas || gridObjects.length === 0) return;
    
    const checkGridIntegrity = () => {
      try {
        const compromisedGrids = gridObjects.filter(obj => 
          !canvas.contains(obj) || 
          (obj.visible !== visible) ||
          !obj.width || 
          !obj.height
        );
        
        if (compromisedGrids.length > 0) {
          logger.warn(`Found ${compromisedGrids.length} compromised grid lines`);
          captureMessage("Grid integrity compromised", {
            level: 'warning',
            tags: { component: 'MobileGridLayer' },
            extra: { 
              compromisedCount: compromisedGrids.length,
              totalGridLines: gridObjects.length
            }
          });
          
          // Recreate the grid if more than 50% is compromised
          if (compromisedGrids.length > gridObjects.length * 0.5) {
            logger.warn("Grid severely compromised, recreating...");
            gridCreatedRef.current = false;
            setGridObjects([]);
          } else {
            // Just fix the ones that are compromised
            compromisedGrids.forEach(obj => {
              obj.set('visible', visible);
            });
          }
          
          canvas.requestRenderAll();
        }
      } catch (error) {
        logger.error("Error checking grid integrity:", error);
        captureError(error, {
          tags: { component: 'MobileGridLayer' },
          extra: { action: 'integrityCheck' }
        });
      }
    };
    
    // Check grid integrity every 5 seconds
    const intervalId = setInterval(checkGridIntegrity, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [canvas, gridObjects, visible]);
  
  return null; // This component doesn't render anything visible
};

export default MobileGridLayer;
