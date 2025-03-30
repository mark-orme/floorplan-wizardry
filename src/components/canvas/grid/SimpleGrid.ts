
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid } from "@/utils/simpleGridCreator";

/**
 * Props for SimpleGrid constructor
 */
interface SimpleGridProps {
  canvas: FabricCanvas;
  showControls?: boolean;
  defaultVisible?: boolean;
  onGridCreated?: (objects: FabricObject[]) => void;
}

/**
 * SimpleGrid class for creating and managing grid on the canvas
 */
export class SimpleGrid {
  private canvas: FabricCanvas;
  private gridObjects: FabricObject[] = [];
  private visible: boolean;
  private showControls: boolean;
  
  /**
   * Create a new SimpleGrid instance
   * @param props SimpleGrid props
   */
  constructor(props: SimpleGridProps) {
    this.canvas = props.canvas;
    this.showControls = props.showControls || false;
    this.visible = props.defaultVisible || true;
    
    // Create grid on instantiation
    this.createGrid();
    
    // Call callback if provided
    if (props.onGridCreated) {
      props.onGridCreated(this.gridObjects);
    }
  }
  
  /**
   * Create the grid on the canvas
   */
  private createGrid(): void {
    try {
      const gridObjects = createSimpleGrid(this.canvas);
      this.gridObjects = gridObjects;
      console.log(`SimpleGrid created with ${gridObjects.length} objects`);
    } catch (error) {
      console.error("Error creating simple grid:", error);
    }
  }
  
  /**
   * Show the grid
   */
  public show(): void {
    if (!this.visible) {
      this.gridObjects.forEach(obj => {
        obj.set('visible', true);
      });
      this.visible = true;
      this.canvas.requestRenderAll();
    }
  }
  
  /**
   * Hide the grid
   */
  public hide(): void {
    if (this.visible) {
      this.gridObjects.forEach(obj => {
        obj.set('visible', false);
      });
      this.visible = false;
      this.canvas.requestRenderAll();
    }
  }
  
  /**
   * Toggle grid visibility
   */
  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  /**
   * Get grid objects
   */
  public getObjects(): FabricObject[] {
    return this.gridObjects;
  }
  
  /**
   * Destroy the grid
   */
  public destroy(): void {
    this.gridObjects.forEach(obj => {
      if (this.canvas.contains(obj)) {
        this.canvas.remove(obj);
      }
    });
    this.gridObjects = [];
    this.canvas.requestRenderAll();
  }
}
