
import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';
import { toast } from 'sonner';
import { GridMonitor } from './GridMonitor';

type GridLine = fabric.Object & { visible?: boolean };

interface SimpleGridProps {
  canvas: fabric.Canvas;
  showControls?: boolean;
  defaultVisible?: boolean;
  onGridCreated?: (gridObjects: fabric.Object[]) => void;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  showControls = false,
  defaultVisible = true,
  onGridCreated
}) => {
  const [gridObjects, setGridObjects] = useState<GridLine[]>([]);
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [creationComplete, setCreationComplete] = useState(false);
  
  // Create grid on component mount
  useEffect(() => {
    if (!canvas) return;
    
    try {
      console.log('SimpleGrid: Creating grid on canvas');
      
      // Create the grid
      const objects = createGrid(canvas) as GridLine[];
      
      setGridObjects(objects);
      setCreationComplete(true);
      
      // Set initial visibility
      if (objects.length > 0) {
        objects.forEach(obj => {
          if (obj) {
            obj.visible = defaultVisible;
          }
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
      const newObjects = createGrid(canvas) as GridLine[];
      
      // Set visibility and update state
      newObjects.forEach(obj => {
        if (obj) {
          obj.visible = isVisible;
        }
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
  
  // Create a simple grid
  const createGrid = (canvas: fabric.Canvas): fabric.Object[] => {
    const gridObjects: fabric.Object[] = [];
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const gridSize = 50;
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new fabric.Line([0, y, width, y], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  };
  
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
