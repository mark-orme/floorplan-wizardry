
/**
 * BasicGrid Component
 * A simple grid creator component for canvas
 * @module components/BasicGrid
 */
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid } from '@/utils/grid/gridCreationUtils';
import { ensureGridVisibility } from '@/utils/grid/simpleGridCreator';

/**
 * Props for the BasicGrid component
 */
interface BasicGridProps {
  /** The fabric canvas instance */
  canvas: FabricCanvas;
  /** Default grid visibility */
  visible?: boolean;
  /** Callback when grid is created */
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * BasicGrid Component
 * Creates a basic grid on canvas
 * 
 * @param {BasicGridProps} props - Component properties
 * @returns {null} This component doesn't render anything
 */
export const BasicGrid: React.FC<BasicGridProps> = ({
  canvas,
  visible = true,
  onGridCreated
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create grid on mount
  useEffect(() => {
    if (!canvas) return;
    
    try {
      // Create grid
      const gridObjects = createBasicEmergencyGrid(canvas);
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Set initial visibility
      if (!visible) {
        gridObjects.forEach(obj => {
          obj.visible = false;
        });
        canvas.requestRenderAll();
      }
      
      // Call callback if provided
      if (onGridCreated) {
        onGridCreated(gridObjects);
      }
    } catch (error) {
      console.error('Error creating grid:', error);
    }
    
    // Clean up grid on unmount
    return () => {
      if (canvas && gridObjectsRef.current) {
        try {
          gridObjectsRef.current.forEach(obj => {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          });
          canvas.requestRenderAll();
        } catch (error) {
          console.error('Error cleaning up grid:', error);
        }
      }
    };
  }, [canvas, visible, onGridCreated]);
  
  // Ensure grid visibility when component updates
  useEffect(() => {
    if (!canvas) return;
    
    // Update visibility whenever it changes
    gridObjectsRef.current.forEach(obj => {
      if (obj) {
        obj.visible = visible;
      }
    });
    
    // Ensure grid exists on canvas
    ensureGridVisibility(canvas, gridObjectsRef.current);
    
    canvas.requestRenderAll();
  }, [canvas, visible]);
  
  // This component doesn't render anything
  return null;
};
