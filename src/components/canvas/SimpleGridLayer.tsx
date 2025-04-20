import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Group } from 'fabric';
import { Point } from '@/types/core/Point';

interface SimpleGridProps {
  canvas: FabricCanvas | null;
  showControls?: boolean;
  defaultVisible?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({ canvas, showControls = true, defaultVisible = true, onGridCreated }) => {
  const [gridSize, setGridSize] = useState(50);
  const [lineColor, setLineColor] = useState('#e0e0e0');
  const [visible, setVisible] = useState(defaultVisible);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  const createGrid = useCallback(() => {
    if (!canvas) return [];
    
    const gridObjects: FabricObject[] = [];
    const width = canvas.getWidth() || 1000;
    const height = canvas.getHeight() || 800;
    
    for (let i = gridSize; i < width; i += gridSize) {
      const line = new FabricObject('line', {
        x1: i,
        y1: 0,
        x2: i,
        y2: height,
        stroke: lineColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        visible: visible
      });
      gridObjects.push(line);
    }
    
    for (let j = gridSize; j < height; j += gridSize) {
      const line = new FabricObject('line', {
        x1: 0,
        y1: j,
        x2: width,
        y2: j,
        stroke: lineColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        visible: visible
      });
      gridObjects.push(line);
    }
    
    return gridObjects;
  }, [canvas, gridSize, lineColor, visible]);
  
  useEffect(() => {
    if (!canvas) return;
    
    // Remove old grid
    gridObjectsRef.current.forEach(obj => canvas.remove(obj));
    gridObjectsRef.current = [];
    
    // Create new grid
    const gridObjects = createGrid();
    gridObjectsRef.current = gridObjects;
    
    // Add new grid to canvas
    gridObjects.forEach(obj => canvas.add(obj));
    
    // Send callback with grid objects
    if (onGridCreated) {
      onGridCreated(gridObjects);
    }
    
    // Ensure grid is rendered behind other objects
    gridObjects.forEach(obj => obj.sendToBack());
    
    canvas.requestRenderAll();
    
    // Debugging
    console.log(`Grid created with ${gridObjects.length} objects`);
  }, [canvas, gridSize, lineColor, visible, createGrid, onGridCreated]);
  
  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGridSize(parseInt(event.target.value, 10));
  };
  
  const handleLineColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLineColor(event.target.value);
  };
  
  const handleVisibleChange = () => {
    setVisible(!visible);
  };
  
  return (
    <div className="grid-controls">
      {showControls && (
        <>
          <label>
            Grid Size:
            <input type="number" value={gridSize} onChange={handleGridSizeChange} />
          </label>
          <label>
            Line Color:
            <input type="color" value={lineColor} onChange={handleLineColorChange} />
          </label>
          <label>
            Visible:
            <input type="checkbox" checked={visible} onChange={handleVisibleChange} />
          </label>
        </>
      )}
    </div>
  );
};
