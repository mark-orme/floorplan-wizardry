
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface BasicGridProps {
  canvas: FabricCanvas;
  visible?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

export const BasicGrid: React.FC<BasicGridProps> = ({
  canvas,
  visible = true,
  onGridCreated
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const [isGridCreated, setIsGridCreated] = useState(false);
  const gridCreationAttemptedRef = useRef(false);
  
  // Create grid when component mounts or canvas changes - ONCE
  useEffect(() => {
    if (!canvas) return;
    
    // Prevent multiple creation attempts
    if (gridCreationAttemptedRef.current || isGridCreated) return;
    gridCreationAttemptedRef.current = true;
    
    // Check if canvas is actually ready with dimensions
    if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
      console.warn("Canvas dimensions not set, grid creation delayed");
      return;
    }
    
    console.log("Creating basic grid with dimensions:", canvas.width, "x", canvas.height);
    
    // Create grid objects
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Create horizontal grid lines (small grid)
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical grid lines (small grid)
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal grid lines (large grid)
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical grid lines (large grid)
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Store grid objects
    gridObjectsRef.current = gridObjects;
    
    // Update visibility
    updateGridVisibility(visible);
    
    // Mark grid as created
    setIsGridCreated(true);
    
    // Call callback if provided - ONLY ONCE
    if (onGridCreated) {
      onGridCreated(gridObjects);
    }
    
    console.log(`Grid created with ${gridObjects.length} lines`);
    
    // Set initial render
    canvas.requestRenderAll();
    
    // Clean up when component unmounts
    return () => {
      gridObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      canvas.requestRenderAll();
    };
  }, [canvas, onGridCreated]); // Remove visible from dependencies
  
  // Separate effect for visibility changes
  useEffect(() => {
    if (isGridCreated) {
      updateGridVisibility(visible);
    }
  }, [visible, isGridCreated]);
  
  // Update grid visibility - memoized to avoid recreating the function
  const updateGridVisibility = useCallback((isVisible: boolean) => {
    if (!canvas || gridObjectsRef.current.length === 0) return;
    
    gridObjectsRef.current.forEach(obj => {
      obj.set('visible', isVisible);
    });
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  return null; // This component doesn't render anything
};
