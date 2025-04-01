
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createCompleteGrid, createBasicEmergencyGrid } from '@/utils/grid/gridRenderers';
import { toast } from 'sonner';

interface SimpleGridProps {
  /** The fabric canvas instance */
  canvas: FabricCanvas;
  /** Whether to show grid control UI */
  showControls?: boolean;
  /** Default grid visibility */
  defaultVisible?: boolean;
  /** Callback when grid is created */
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * Simple grid component for canvas
 * Creates and manages a grid on a fabric canvas
 */
export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  showControls = false,
  defaultVisible = true,
  onGridCreated
}) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const [visible, setVisible] = useState(defaultVisible);
  
  // Create grid on mount
  useEffect(() => {
    if (!canvas) return;
    
    try {
      console.log("Creating grid on canvas");
      
      // Remove any existing grid objects first
      const existingGridObjects = canvas.getObjects().filter(obj => 
        (obj as any).objectType === 'grid' || (obj as any).isGrid === true
      );
      
      if (existingGridObjects.length > 0) {
        existingGridObjects.forEach(obj => {
          canvas.remove(obj);
        });
      }
      
      // Create grid
      const newGridObjects = createCompleteGrid(canvas);
      
      // If regular grid creation fails, try emergency grid
      if (!newGridObjects || newGridObjects.length === 0) {
        console.warn("Complete grid creation failed, trying emergency grid");
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        
        if (emergencyGrid.length > 0) {
          setGridObjects(emergencyGrid);
          
          if (onGridCreated) {
            onGridCreated(emergencyGrid);
          }
        } else {
          toast.error("Failed to create grid");
        }
      } else {
        setGridObjects(newGridObjects);
        
        if (onGridCreated) {
          onGridCreated(newGridObjects);
        }
      }
      
      // Set initial visibility
      updateVisibility(defaultVisible);
      
    } catch (error) {
      console.error("Error creating grid:", error);
    }
    
    // Cleanup on unmount
    return () => {
      if (!canvas) return;
      
      gridObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    };
  }, [canvas, defaultVisible, onGridCreated]);
  
  // Update visibility when it changes
  useEffect(() => {
    updateVisibility(visible);
  }, [visible]);
  
  // Helper to update grid visibility
  const updateVisibility = (isVisible: boolean) => {
    if (!canvas || gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      obj.set('visible', isVisible);
    });
    
    canvas.requestRenderAll();
  };
  
  // Toggle grid visibility
  const toggleVisibility = () => {
    setVisible(prev => !prev);
  };
  
  return (
    <>
      {showControls && (
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
          <button
            className={`px-3 py-1 rounded text-sm ${
              visible ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={toggleVisibility}
          >
            {visible ? 'Hide Grid' : 'Show Grid'}
          </button>
        </div>
      )}
    </>
  );
};
