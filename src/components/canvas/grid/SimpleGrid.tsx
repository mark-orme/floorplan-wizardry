
/**
 * Simple Grid component
 * Creates and manages a grid on the canvas
 */
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid, toggleGridVisibility } from '@/utils/canvasGrid';

interface SimpleGridProps {
  canvas: FabricCanvas;
  defaultVisible?: boolean;
  showControls?: boolean;
  onGridCreated?: (objects: FabricObject[]) => void;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  defaultVisible = true,
  showControls = false,
  onGridCreated
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const gridCreatedRef = useRef(false);
  
  // Create grid on initial render
  useEffect(() => {
    if (!canvas || gridCreatedRef.current) return;
    
    // Create the grid
    try {
      console.log('Creating grid on canvas');
      const gridObjects = createGrid(canvas);
      
      if (gridObjects.length > 0) {
        gridObjectsRef.current = gridObjects;
        gridCreatedRef.current = true;
        
        // Set grid visibility
        toggleGridVisibility(canvas, defaultVisible);
        
        // Notify parent component
        if (onGridCreated) {
          onGridCreated(gridObjects);
        }
        
        console.log(`Grid created with ${gridObjects.length} objects`);
      }
    } catch (error) {
      console.error('Error creating grid:', error);
    }
    
    return () => {
      // Clean up grid on unmount
      if (canvas && gridObjectsRef.current.length > 0) {
        gridObjectsRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        canvas.renderAll();
      }
    };
  }, [canvas, defaultVisible, onGridCreated]);
  
  // Toggle grid visibility
  const handleToggleGrid = () => {
    if (canvas) {
      const newVisibility = !gridObjectsRef.current[0]?.visible;
      toggleGridVisibility(canvas, newVisibility);
    }
  };
  
  // Render toggle button if showControls is true
  if (!showControls) {
    return null;
  }
  
  return (
    <div className="absolute bottom-4 right-4">
      <button 
        className="bg-white border border-gray-300 px-3 py-1 rounded shadow text-sm"
        onClick={handleToggleGrid}
      >
        {gridObjectsRef.current[0]?.visible ? 'Hide Grid' : 'Show Grid'}
      </button>
    </div>
  );
};
