
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Options for SimpleGrid class
 */
export interface SimpleGridOptions {
  canvas: FabricCanvas;
  showControls?: boolean;
  defaultVisible?: boolean;
  gridSize?: number;
  smallGridColor?: string;
  largeGridColor?: string;
}

/**
 * SimpleGrid class for creating and managing grid
 */
export class SimpleGrid {
  private canvas: FabricCanvas;
  private gridObjects: FabricObject[] = [];
  private isVisible: boolean;
  private options: Required<Omit<SimpleGridOptions, 'canvas'>>;

  /**
   * Create a new SimpleGrid instance
   * @param options Grid options
   */
  constructor(options: SimpleGridOptions) {
    this.canvas = options.canvas;
    
    // Set default options
    this.options = {
      showControls: options.showControls || false,
      defaultVisible: options.defaultVisible !== undefined ? options.defaultVisible : true,
      gridSize: options.gridSize || GRID_CONSTANTS.SMALL_GRID_SIZE,
      smallGridColor: options.smallGridColor || GRID_CONSTANTS.SMALL_GRID_COLOR,
      largeGridColor: options.largeGridColor || GRID_CONSTANTS.LARGE_GRID_COLOR
    };
    
    this.isVisible = this.options.defaultVisible;
    
    // Create grid
    this.create();
  }
  
  /**
   * Create grid on canvas
   */
  private create(): void {
    if (!this.canvas) return;
    
    try {
      // Get canvas dimensions
      const width = this.canvas.width || 800;
      const height = this.canvas.height || 600;
      
      // Clear any existing grid
      this.clear();
      
      // Create small grid lines
      for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
        const line = new Line([i, 0, i, height], {
          stroke: this.options.smallGridColor,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        });
        this.canvas.add(line);
        this.gridObjects.push(line);
      }
      
      for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
        const line = new Line([0, i, width, i], {
          stroke: this.options.smallGridColor,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        });
        this.canvas.add(line);
        this.gridObjects.push(line);
      }
      
      // Create large grid lines
      for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
        const line = new Line([i, 0, i, height], {
          stroke: this.options.largeGridColor,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        });
        this.canvas.add(line);
        this.gridObjects.push(line);
      }
      
      for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
        const line = new Line([0, i, width, i], {
          stroke: this.options.largeGridColor,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          isGrid: true
        });
        this.canvas.add(line);
        this.gridObjects.push(line);
      }
      
      // Set visibility based on options
      if (!this.isVisible) {
        this.hide();
      }
      
      // Force render
      this.canvas.requestRenderAll();
      
      console.log(`Created grid with ${this.gridObjects.length} objects`);
    } catch (error) {
      console.error("Error creating grid:", error);
    }
  }
  
  /**
   * Show grid
   */
  public show(): void {
    if (!this.canvas) return;
    
    this.gridObjects.forEach(obj => {
      obj.visible = true;
    });
    
    this.isVisible = true;
    this.canvas.requestRenderAll();
  }
  
  /**
   * Hide grid
   */
  public hide(): void {
    if (!this.canvas) return;
    
    this.gridObjects.forEach(obj => {
      obj.visible = false;
    });
    
    this.isVisible = false;
    this.canvas.requestRenderAll();
  }
  
  /**
   * Toggle grid visibility
   */
  public toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  /**
   * Clear grid from canvas
   */
  public clear(): void {
    if (!this.canvas) return;
    
    this.gridObjects.forEach(obj => {
      if (this.canvas.contains(obj)) {
        this.canvas.remove(obj);
      }
    });
    
    this.gridObjects = [];
    this.canvas.requestRenderAll();
  }
  
  /**
   * Check if grid is visible
   */
  public isGridVisible(): boolean {
    return this.isVisible;
  }
  
  /**
   * Get grid objects
   */
  public getObjects(): FabricObject[] {
    return this.gridObjects;
  }
  
  /**
   * Reset grid (clear and recreate)
   */
  public reset(): void {
    this.clear();
    this.create();
  }
  
  /**
   * Cleanup and destroy grid
   */
  public destroy(): void {
    this.clear();
    this.gridObjects = [];
  }
}
