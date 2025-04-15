import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";
import { toast } from "sonner";
import { ensureGridIsPresent, setupGridMonitoring } from "@/utils/grid/gridVisibilityManager";

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
  private initialized = false;
  private monitoringCleanup: (() => void) | null = null;

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
      
      // Set up monitoring
      this.monitoringCleanup = setupGridMonitoring(this.canvas, 3000);
    }
  }

  private createGrid(): FabricObject[] {
    try {
      // Use our ensureGridIsPresent utility for robust grid creation
      const result = ensureGridIsPresent(this.canvas);
      
      // Store grid objects reference
      this.gridObjects = result.gridObjects;
      
      // Set initialization flag
      this.initialized = result.success && result.gridObjects.length > 0;
      
      // Call callback if provided
      if (this.initialized && this.onGridCreated) {
        this.onGridCreated(this.gridObjects);
      }
      
      // Log result
      if (result.action === 'created') {
        logger.info(`Grid created with ${result.gridObjects.length} lines`);
      } else if (result.action === 'fixed') {
        logger.info(`Fixed visibility for ${result.gridObjects.length} grid objects`);
      }
      
      return this.gridObjects;
    } catch (error) {
      logger.error("Error creating grid:", error);
      console.error("[CRITICAL] Grid creation failed:", error);
      
      // Only show toast if this is not a follow-up attempt
      if (!this.initialized) {
        toast.error("Grid creation failed. Please refresh the page.");
      }
      
      return [];
    }
  }

  // Method to update grid if canvas size changes
  public updateGrid(): void {
    this.initialized = false; // Reset initialization flag
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
  
  // Method to check grid existence and recreate if missing
  public checkAndFixGrid(): void {
    // Use our grid visibility manager to check and fix
    const result = ensureGridIsPresent(this.canvas);
    
    if (result.action !== 'none') {
      // Update grid objects reference
      this.gridObjects = result.gridObjects;
      logger.info(`Grid ${result.action === 'created' ? 'created' : 'fixed'} with ${result.gridObjects.length} objects`);
    }
  }
  
  // Clean up resources
  public destroy(): void {
    if (this.monitoringCleanup) {
      this.monitoringCleanup();
      this.monitoringCleanup = null;
    }
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
        gridRendererRef.current.destroy();
      }
    };
  }, [canvas, showGrid, onGridCreated]);
  
  return null; // This component doesn't render anything
};
