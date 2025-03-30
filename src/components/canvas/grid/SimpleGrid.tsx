
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createReliableGrid, ensureGridVisibility } from '@/utils/grid/simpleGridCreator';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';

interface SimpleGridProps {
  canvas: FabricCanvas;
  showControls?: boolean;
  onGridCreated?: (objects: FabricObject[]) => void;
  defaultVisible?: boolean;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  showControls = false,
  onGridCreated,
  defaultVisible = true
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const [visible, setVisible] = React.useState(defaultVisible);
  
  // Create grid on component mount
  useEffect(() => {
    if (!canvas) return;
    
    // Create grid on 100ms delay to ensure canvas is fully ready
    const timer = setTimeout(() => {
      try {
        console.log('SimpleGrid: Creating grid on canvas');
        const gridObjects = createReliableGrid(canvas, { current: gridObjectsRef.current });
        gridObjectsRef.current = gridObjects;
        
        if (onGridCreated && gridObjects.length > 0) {
          onGridCreated(gridObjects);
        }
        
        // Make objects visible or hidden based on current visibility setting
        if (!visible) {
          gridObjects.forEach(obj => {
            obj.visible = false;
          });
          canvas.requestRenderAll();
        }
      } catch (error) {
        console.error('Error creating grid:', error);
      }
    }, 100);
    
    // Check grid visibility every 3 seconds
    const intervalId = setInterval(() => {
      if (visible && gridObjectsRef.current.length > 0) {
        ensureGridVisibility(canvas, { current: gridObjectsRef.current });
      }
    }, GRID_CONSTANTS.VISIBILITY_CHECK_INTERVAL);
    
    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, [canvas, onGridCreated, visible]);
  
  // Toggle grid visibility
  const toggleGridVisibility = () => {
    setVisible(prev => {
      const newVisible = !prev;
      
      if (gridObjectsRef.current.length > 0) {
        gridObjectsRef.current.forEach(obj => {
          obj.visible = newVisible;
        });
        canvas.requestRenderAll();
      }
      
      toast.success(newVisible ? 'Grid shown' : 'Grid hidden');
      return newVisible;
    });
  };
  
  // Recreate grid from scratch
  const recreateGrid = () => {
    if (!canvas) return;
    
    try {
      // Remove existing grid objects
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Create new grid
      const gridObjects = createReliableGrid(canvas, { current: [] });
      gridObjectsRef.current = gridObjects;
      
      if (onGridCreated && gridObjects.length > 0) {
        onGridCreated(gridObjects);
      }
      
      toast.success(`Grid recreated with ${gridObjects.length} objects`);
    } catch (error) {
      console.error('Error recreating grid:', error);
      toast.error('Failed to recreate grid');
    }
  };
  
  // If we don't need to show controls, return null (the grid is still created)
  if (!showControls) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-white/80 p-2 rounded-md shadow-md z-10 text-xs">
      <div className="flex gap-2">
        <button
          className={`px-2 py-1 rounded text-xs ${visible ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={toggleGridVisibility}
        >
          {visible ? 'Hide Grid' : 'Show Grid'}
        </button>
        
        <button
          className="px-2 py-1 rounded text-xs bg-gray-200"
          onClick={recreateGrid}
        >
          Recreate Grid
        </button>
      </div>
      
      <div className="mt-1 text-[10px] text-gray-600">
        {gridObjectsRef.current.length > 0 ? 
          `${gridObjectsRef.current.length} grid objects` : 
          'No grid created yet'}
      </div>
    </div>
  );
};
