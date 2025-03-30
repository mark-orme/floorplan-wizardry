
/**
 * SimpleGrid Component
 * A React component for creating and managing grid on canvas
 * @module components/canvas/grid/SimpleGrid
 */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Grid } from 'lucide-react';
import { createCompleteGrid } from '@/utils/grid/gridCreationUtils';
import { ensureGridVisibility } from '@/utils/grid/simpleGridCreator';

/**
 * Props for the SimpleGrid component
 */
interface SimpleGridProps {
  /** The fabric canvas instance */
  canvas: FabricCanvas;
  /** Whether to show grid controls */
  showControls?: boolean;
  /** Default grid visibility */
  defaultVisible?: boolean;
  /** Callback when grid is created */
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * SimpleGrid Component
 * Creates and manages grid on canvas
 * 
 * @param {SimpleGridProps} props - Component properties
 * @returns {JSX.Element | null} Rendered component
 */
export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  showControls = false,
  defaultVisible = true,
  onGridCreated
}) => {
  const [gridVisible, setGridVisible] = useState(defaultVisible);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create grid on mount
  useEffect(() => {
    if (!canvas) return;
    
    try {
      // Create grid
      const gridObjects = createCompleteGrid(canvas);
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Set initial visibility
      if (!defaultVisible) {
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
  }, [canvas, defaultVisible, onGridCreated]);
  
  // Handle visibility changes
  useEffect(() => {
    if (!canvas || gridObjectsRef.current.length === 0) return;
    
    gridObjectsRef.current.forEach(obj => {
      obj.visible = gridVisible;
    });
    
    canvas.requestRenderAll();
  }, [canvas, gridVisible]);
  
  // Toggle grid visibility
  const toggleGridVisibility = () => {
    if (!canvas) return;
    
    // Ensure grid exists
    if (gridObjectsRef.current.length === 0 || !canvas.contains(gridObjectsRef.current[0])) {
      ensureGridVisibility(canvas, gridObjectsRef);
    }
    
    setGridVisible(!gridVisible);
  };
  
  // Only render controls if requested
  if (!showControls) return null;
  
  return (
    <div className="absolute top-2 right-2 z-10">
      <Button
        variant="outline"
        size="sm"
        title={gridVisible ? "Hide Grid" : "Show Grid"}
        onClick={toggleGridVisibility}
      >
        <Grid className="h-4 w-4" />
        <span className="ml-1">{gridVisible ? "Hide" : "Show"} Grid</span>
      </Button>
    </div>
  );
};
