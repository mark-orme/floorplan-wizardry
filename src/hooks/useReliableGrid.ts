
import { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

interface UseReliableGridOptions {
  canvas: FabricCanvas | null;
  gridSpacing?: number;
  enabled?: boolean;
}

export function useReliableGrid({
  canvas,
  gridSpacing = 20,
  enabled = true
}: UseReliableGridOptions) {
  const [isGridCreated, setIsGridCreated] = useState(false);
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);

  // Initialize grid
  useEffect(() => {
    if (!canvas || !enabled) return;

    // Create grid
    const createGrid = () => {
      try {
        // Clean up any existing grid
        gridObjects.forEach(obj => {
          canvas.remove(obj);
        });

        const width = canvas.getWidth();
        const height = canvas.getHeight();
        const newGridObjects: FabricObject[] = [];

        // Create horizontal lines
        for (let y = 0; y <= height; y += gridSpacing) {
          const line = new window.fabric.Line([0, y, width, y], {
            stroke: '#e0e0e0',
            strokeWidth: 1,
            opacity: 0.5,
            selectable: false,
            evented: false
          });
          canvas.add(line);
          newGridObjects.push(line);
        }

        // Create vertical lines
        for (let x = 0; x <= width; x += gridSpacing) {
          const line = new window.fabric.Line([x, 0, x, height], {
            stroke: '#e0e0e0',
            strokeWidth: 1,
            opacity: 0.5,
            selectable: false,
            evented: false
          });
          canvas.add(line);
          newGridObjects.push(line);
        }

        setGridObjects(newGridObjects);
        setIsGridCreated(true);
        canvas.requestRenderAll();
      } catch (error) {
        console.error('Error creating grid:', error);
        setIsGridCreated(false);
      }
    };

    createGrid();

    // Cleanup
    return () => {
      if (canvas) {
        gridObjects.forEach(obj => {
          canvas.remove(obj);
        });
      }
    };
  }, [canvas, gridSpacing, enabled]);

  // Reinitialize grid
  const reinitializeGrid = () => {
    if (!canvas || !enabled) return;

    setIsGridCreated(false);
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    setGridObjects([]);

    // Recreate grid
    setTimeout(() => {
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      const newGridObjects: FabricObject[] = [];

      // Create horizontal lines
      for (let y = 0; y <= height; y += gridSpacing) {
        const line = new window.fabric.Line([0, y, width, y], {
          stroke: '#e0e0e0',
          strokeWidth: 1,
          opacity: 0.5,
          selectable: false,
          evented: false
        });
        canvas.add(line);
        newGridObjects.push(line);
      }

      // Create vertical lines
      for (let x = 0; x <= width; x += gridSpacing) {
        const line = new window.fabric.Line([x, 0, x, height], {
          stroke: '#e0e0e0',
          strokeWidth: 1,
          opacity: 0.5,
          selectable: false,
          evented: false
        });
        canvas.add(line);
        newGridObjects.push(line);
      }

      setGridObjects(newGridObjects);
      setIsGridCreated(true);
      canvas.requestRenderAll();
    }, 100);
  };

  return {
    isGridCreated,
    gridObjects,
    reinitializeGrid
  };
}
