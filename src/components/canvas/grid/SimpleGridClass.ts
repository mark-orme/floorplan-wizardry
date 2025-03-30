
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createCompleteGrid, createBasicEmergencyGrid } from '@/utils/grid/gridRenderers';

/**
 * Options for SimpleGrid class
 */
interface SimpleGridOptions {
  canvas: FabricCanvas;
  showControls?: boolean;
  defaultVisible?: boolean;
}

/**
 * SimpleGrid class
 * Handles grid creation and management
 */
export class SimpleGridClass {
  private canvas: FabricCanvas;
  private gridObjects: FabricObject[] = [];
  private visible: boolean;
  
  /**
   * Create a new SimpleGrid instance
   */
  constructor(options: SimpleGridOptions) {
    this.canvas = options.canvas;
    this.visible = options.defaultVisible ?? true;
    
    // Create grid
    this.createGrid();
  }
  
  /**
   * Create grid on the canvas
   */
  private createGrid(): void {
    try {
      // Create complete grid
      const gridObjects = createCompleteGrid(this.canvas);
      
      if (gridObjects && gridObjects.length > 0) {
        this.gridObjects = gridObjects;
      } else {
        // Try emergency grid
        this.gridObjects = createBasicEmergencyGrid(this.canvas);
      }
      
      // Set initial visibility
      this.updateVisibility();
      
    } catch (error) {
      console.error("Error creating grid:", error);
      
      // Try emergency grid
      try {
        this.gridObjects = createBasicEmergencyGrid(this.canvas);
        this.updateVisibility();
      } catch (emergencyError) {
        console.error("Emergency grid creation also failed:", emergencyError);
      }
    }
  }
  
  /**
   * Update grid visibility
   */
  private updateVisibility(): void {
    this.gridObjects.forEach(obj => {
      obj.set('visible', this.visible);
    });
    
    this.canvas.requestRenderAll();
  }
  
  /**
   * Show the grid
   */
  public show(): void {
    this.visible = true;
    this.updateVisibility();
  }
  
  /**
   * Hide the grid
   */
  public hide(): void {
    this.visible = false;
    this.updateVisibility();
  }
  
  /**
   * Get grid objects
   */
  public getObjects(): FabricObject[] {
    return this.gridObjects;
  }
  
  /**
   * Remove grid objects from canvas
   */
  public destroy(): void {
    if (this.gridObjects.length > 0) {
      this.gridObjects.forEach(obj => {
        if (this.canvas.contains(obj)) {
          this.canvas.remove(obj);
        }
      });
      
      this.gridObjects = [];
      this.canvas.requestRenderAll();
    }
  }
}
