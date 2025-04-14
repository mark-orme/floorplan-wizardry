
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

interface GridRendererProps {
  canvas: FabricCanvas;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
  showGrid?: boolean;
}

export class GridRenderer {
  private canvas: FabricCanvas;
  private gridObjects: FabricObject[] = [];
  private showGrid: boolean;
  private onGridCreated?: (gridObjects: FabricObject[]) => void;

  constructor({ 
    canvas, 
    onGridCreated, 
    showGrid = true 
  }: GridRendererProps) {
    this.canvas = canvas;
    this.showGrid = showGrid;
    this.onGridCreated = onGridCreated;
    
    // Create grid immediately
    if (this.showGrid) {
      this.createGrid();
    }
  }

  private createGrid(): FabricObject[] {
    try {
      logger.info("Creating grid with 10x10 small grid and larger grid lines");
      
      // Remove any existing grid
      this.gridObjects.forEach(obj => {
        if (this.canvas.contains(obj)) {
          this.canvas.remove(obj);
        }
      });
      
      const gridObjects: FabricObject[] = [];
      const width = Math.max(this.canvas.width || 800, window.innerWidth * 2);
      const height = Math.max(this.canvas.height || 600, window.innerHeight * 2);
      
      // Calculate how many grid lines we need (make sure the grid covers the entire viewport)
      const hLines = Math.ceil(height / GRID_CONSTANTS.SMALL_GRID_SIZE) + 5; // Add extra lines
      const vLines = Math.ceil(width / GRID_CONSTANTS.SMALL_GRID_SIZE) + 5;
      
      // Create small grid lines (10px = 0.1m)
      for (let i = 0; i <= vLines; i++) {
        const xPos = i * GRID_CONSTANTS.SMALL_GRID_SIZE;
        const line = new Line([xPos, 0, xPos, height], {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        } as any);
        this.canvas.add(line);
        gridObjects.push(line);
      }
      
      for (let i = 0; i <= hLines; i++) {
        const yPos = i * GRID_CONSTANTS.SMALL_GRID_SIZE;
        const line = new Line([0, yPos, width, yPos], {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        } as any);
        this.canvas.add(line);
        gridObjects.push(line);
      }
      
      // Create larger grid lines (100px = 1.0m)
      for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
        const line = new Line([i, 0, i, height], {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        } as any);
        this.canvas.add(line);
        gridObjects.push(line);
      }
      
      for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
        const line = new Line([0, i, width, i], {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        } as any);
        this.canvas.add(line);
        gridObjects.push(line);
      }
      
      // Store grid objects reference
      this.gridObjects = gridObjects;
      
      // Send all grid objects to the back
      gridObjects.forEach(obj => {
        // Use sendToBack on each object rather than on the canvas
        this.canvas.sendObjectToBack(obj);
      });
      
      // Call callback if provided
      if (this.onGridCreated) {
        this.onGridCreated(gridObjects);
      }
      
      // Ensure grid is visible by rendering the canvas
      this.canvas.requestRenderAll();
      
      logger.info(`Grid created with ${gridObjects.length} lines`);
      return gridObjects;
    } catch (error) {
      logger.error("Error creating grid:", error);
      return [];
    }
  }

  // Method to update grid if canvas size changes
  public updateGrid(): void {
    this.createGrid();
  }

  // Method to toggle grid visibility
  public toggleVisibility(visible: boolean): void {
    this.showGrid = visible;
    this.gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    this.canvas.requestRenderAll();
  }
}

// React component wrapper for class-based implementation
export const GridRendererComponent: React.FC<GridRendererProps> = ({
  canvas,
  onGridCreated,
  showGrid = true
}) => {
  // Keep references to grid objects
  const gridRendererRef = useRef<GridRenderer | null>(null);
  
  // Create the grid when the component mounts or canvas changes
  useEffect(() => {
    if (!canvas || !showGrid) return;
    
    // Create grid renderer instance
    gridRendererRef.current = new GridRenderer({
      canvas,
      onGridCreated,
      showGrid
    });
    
    // Clean up function
    return () => {
      if (gridRendererRef.current) {
        gridRendererRef.current.toggleVisibility(false);
      }
    };
  }, [canvas, showGrid, onGridCreated]);
  
  return null; // This component doesn't render anything
};
