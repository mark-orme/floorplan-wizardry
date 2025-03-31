import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

interface GridRendererProps {
  canvas: FabricCanvas;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
  showGrid?: boolean;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  canvas,
  onGridCreated,
  showGrid = true
}) => {
  // Keep references to grid objects
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create the grid when the component mounts or canvas changes
  useEffect(() => {
    if (!canvas || !showGrid) return;
    
    const createGrid = () => {
      try {
        logger.info("Creating grid with 10x10 small grid and larger grid lines");
        
        // Remove any existing grid
        gridObjectsRef.current.forEach(obj => {
          canvas.remove(obj);
        });
        
        const gridObjects: FabricObject[] = [];
        const width = canvas.width || 800;
        const height = canvas.height || 600;
        
        // Create small grid lines (10px = 0.1m)
        for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
          const line = new Line([0, i, width, i], {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid',
            isGrid: true
          } as any);
          canvas.add(line);
          gridObjects.push(line);
        }
        
        for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
          const line = new Line([i, 0, i, height], {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid',
            isGrid: true
          } as any);
          canvas.add(line);
          gridObjects.push(line);
        }
        
        // Create larger grid lines (100px = 1.0m)
        for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
          const line = new Line([0, i, width, i], {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid',
            isGrid: true
          } as any);
          canvas.add(line);
          gridObjects.push(line);
        }
        
        for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
          const line = new Line([i, 0, i, height], {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid',
            isGrid: true
          } as any);
          canvas.add(line);
          gridObjects.push(line);
        }
        
        // Store grid objects reference
        gridObjectsRef.current = gridObjects;
        
        // Send all grid objects to the back
        gridObjects.forEach(obj => {
          canvas.sendObjectToBack(obj);
        });
        
        // Call callback if provided
        if (onGridCreated) {
          onGridCreated(gridObjects);
        }
        
        // Ensure grid is visible by rendering the canvas
        canvas.requestRenderAll();
        
        logger.info(`Grid created with ${gridObjects.length} lines`);
        return gridObjects;
      } catch (error) {
        logger.error("Error creating grid:", error);
        return [];
      }
    };
    
    // Create the grid
    const gridObjects = createGrid();
    
    // Clean up function
    return () => {
      gridObjects.forEach(obj => {
        canvas.remove(obj);
      });
      canvas.requestRenderAll();
    };
  }, [canvas, showGrid, onGridCreated]);
  
  return null; // This component doesn't render anything
};
