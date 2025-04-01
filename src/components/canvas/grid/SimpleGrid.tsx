
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from '@/utils/grid/gridRenderers';
import { ensureGridVisibility } from '@/utils/grid/gridVisibility';
import { toast } from 'sonner';
import { GridMonitor } from './GridMonitor';

interface SimpleGridProps {
  canvas: FabricCanvas;
  showControls?: boolean;
  defaultVisible?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  showControls = false,
  defaultVisible = true,
  onGridCreated
}) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [creationComplete, setCreationComplete] = useState(false);
  
  // Create grid on component mount
  useEffect(() => {
    if (!canvas) return;
    
    try {
      console.log('SimpleGrid: Creating grid on canvas');
      
      // Create the grid
      const objects = createGrid(canvas);
      
      setGridObjects(objects);
      setCreationComplete(true);
      
      // Set initial visibility
      if (objects.length > 0) {
        objects.forEach(obj => {
          obj.visible = defaultVisible;
        });
        canvas.requestRenderAll();
        
        // Notify parent
        if (onGridCreated) {
          onGridCreated(objects);
        }
        
        console.log(`SimpleGrid: Created ${objects.length} grid objects`);
      } else {
        console.warn('SimpleGrid: No grid objects were created');
      }
    } catch (error) {
      console.error('SimpleGrid: Error creating grid:', error);
      toast.error('Failed to create grid');
    }
  }, [canvas, onGridCreated, defaultVisible]);
  
  // Create function to manually recreate grid
  const recreateGrid = () => {
    if (!canvas) return;
    
    try {
      // Remove existing grid
      gridObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Create new grid
      const newObjects = createGrid(canvas);
      
      // Set visibility and update state
      newObjects.forEach(obj => {
        obj.visible = isVisible;
      });
      
      setGridObjects(newObjects);
      canvas.requestRenderAll();
      
      // Notify parent
      if (onGridCreated) {
        onGridCreated(newObjects);
      }
      
      console.log(`SimpleGrid: Recreated grid with ${newObjects.length} objects`);
    } catch (error) {
      console.error('SimpleGrid: Error recreating grid:', error);
    }
  };
  
  // Log a message when component unmounts
  useEffect(() => {
    return () => {
      console.log('SimpleGrid: Component unmounting');
    };
  }, []);
  
  // Return monitor component if controls are shown
  if (showControls) {
    return (
      <GridMonitor 
        canvas={canvas}
        gridObjects={gridObjects}
        createGrid={recreateGrid}
        visible={showControls}
      />
    );
  }
  
  // Nothing to render otherwise
  return null;
};
