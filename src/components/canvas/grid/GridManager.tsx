
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createCompleteGrid, createBasicEmergencyGrid } from '@/utils/grid/gridRenderers';
import { toast } from 'sonner';

/**
 * Props for GridManager component
 */
interface GridManagerProps {
  canvas: FabricCanvas;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible: boolean;
  onGridCreated?: (objects: FabricObject[]) => void;
}

/**
 * Grid manager component
 * Handles grid creation and maintenance
 */
export const GridManager: React.FC<GridManagerProps> = ({
  canvas,
  gridLayerRef,
  visible,
  onGridCreated
}) => {
  const gridCreatedRef = useRef(false);
  
  // Create grid when component mounts or canvas changes
  useEffect(() => {
    if (!canvas || gridCreatedRef.current) return;
    
    try {
      console.log("Creating grid on canvas");
      
      // Check if canvas has valid dimensions
      if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
        console.error("Grid creation failed: Canvas has zero dimensions");
        return;
      }
      
      // Clear existing grid objects
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      // Create complete grid
      const gridObjects = createCompleteGrid(canvas);
      
      // If grid creation failed, try emergency grid
      if (!gridObjects || gridObjects.length === 0) {
        console.warn("Complete grid creation failed, trying emergency grid");
        
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        if (emergencyGrid.length > 0) {
          gridLayerRef.current = emergencyGrid;
          gridCreatedRef.current = true;
          
          if (onGridCreated) {
            onGridCreated(emergencyGrid);
          }
        } else {
          console.error("Both regular and emergency grid creation failed");
          toast.error("Failed to create grid");
        }
      } else {
        // Grid created successfully
        gridLayerRef.current = gridObjects;
        gridCreatedRef.current = true;
        
        if (onGridCreated) {
          onGridCreated(gridObjects);
        }
      }
      
      // Update grid visibility
      updateGridVisibility(visible);
      
      // Force render to ensure grid is visible
      canvas.requestRenderAll();
      
    } catch (error) {
      console.error("Error creating grid:", error);
      
      // Try emergency grid on error
      try {
        if (canvas) {
          console.log("Attempting emergency grid creation");
          const emergencyGrid = createBasicEmergencyGrid(canvas);
          if (emergencyGrid.length > 0) {
            gridLayerRef.current = emergencyGrid;
            gridCreatedRef.current = true;
            
            if (onGridCreated) {
              onGridCreated(emergencyGrid);
            }
          }
        }
      } catch (emergencyError) {
        console.error("Emergency grid creation also failed:", emergencyError);
      }
    }
  }, [canvas]);
  
  // Update grid visibility when visible prop changes
  useEffect(() => {
    updateGridVisibility(visible);
  }, [visible]);
  
  // Helper function to update grid visibility
  const updateGridVisibility = (isVisible: boolean) => {
    if (!canvas || gridLayerRef.current.length === 0) return;
    
    gridLayerRef.current.forEach(obj => {
      obj.set('visible', isVisible);
    });
    
    canvas.requestRenderAll();
  };
  
  return null; // This component doesn't render anything
};
