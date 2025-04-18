
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createSimpleGrid, ensureGridVisible, createEmergencyGrid } from '@/utils/simpleGridCreator';

interface SimpleGridLayerProps {
  canvas: FabricCanvas | null;
}

export const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({ canvas }) => {
  const [gridCreated, setGridCreated] = useState(false);
  
  useEffect(() => {
    if (!canvas) return;
    
    console.log("SimpleGridLayer: Initializing grid");
    
    // Create grid with a short delay to ensure canvas is ready
    const timer = setTimeout(() => {
      try {
        if (!canvas) return;
        
        // Check if grid already exists
        const existingGrid = canvas.getObjects().filter(obj => 
          (obj as any).objectType === 'grid' || (obj as any).isGrid === true
        );
        
        if (existingGrid.length > 0) {
          console.log(`Grid already exists with ${existingGrid.length} objects, ensuring visibility`);
          ensureGridVisible(canvas, existingGrid);
          setGridCreated(true);
        } else {
          // Create new grid
          console.log("No grid found, creating new grid");
          const gridObjects = createSimpleGrid(canvas);
          
          if (gridObjects.length === 0) {
            // Try emergency grid as fallback
            console.log("Primary grid creation failed, trying emergency grid");
            const emergencyGrid = createEmergencyGrid(canvas);
            setGridCreated(emergencyGrid.length > 0);
          } else {
            setGridCreated(true);
          }
        }
      } catch (error) {
        console.error("Error in SimpleGridLayer:", error);
        
        // Try emergency grid on error
        try {
          if (canvas) {
            console.log("Attempting emergency grid after error");
            const emergencyGrid = createEmergencyGrid(canvas);
            setGridCreated(emergencyGrid.length > 0);
          }
        } catch (emergencyError) {
          console.error("Emergency grid creation also failed:", emergencyError);
        }
      }
    }, 500); // Short delay to ensure canvas is ready
    
    return () => {
      clearTimeout(timer);
    };
  }, [canvas]);
  
  return null; // This is a non-visual component
};

export default SimpleGridLayer;
