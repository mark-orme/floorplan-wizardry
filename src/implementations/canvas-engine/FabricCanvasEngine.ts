
import { Canvas as FabricCanvas, Object as FabricObject, BaseBrush } from 'fabric';
import { Point } from '@/types/core/Point';

interface FabricCanvasOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

/**
 * Implementation of canvas engine using fabric.js
 */
export class FabricCanvasEngine {
  private canvas: FabricCanvas;
  private initialized: boolean = false;
  
  /**
   * Initialize a new Fabric Canvas Engine
   * @param element Canvas element or selector
   * @param options Canvas options
   */
  constructor(element: HTMLCanvasElement, options: FabricCanvasOptions = {}) {
    // Initialize fabric canvas
    this.canvas = new FabricCanvas(element, {
      width: options.width || element.width,
      height: options.height || element.height,
      backgroundColor: options.backgroundColor || '#ffffff',
      preserveObjectStacking: true,
      selection: true,
      stopContextMenu: true
    });
    
    this.initialized = true;
    
    // Set up default brush
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = '#000000';
      this.canvas.freeDrawingBrush.width = 2;
    }
  }
  
  /**
   * Get the underlying fabric canvas
   */
  getCanvas(): FabricCanvas {
    return this.canvas;
  }
  
  /**
   * Clean up the canvas
   */
  dispose() {
    if (this.initialized && this.canvas) {
      this.canvas.dispose();
      this.initialized = false;
    }
  }
  
  /**
   * Set drawing mode
   */
  setDrawingMode(isDrawing: boolean) {
    this.canvas.isDrawingMode = isDrawing;
  }
  
  /**
   * Set brush settings
   */
  setBrushSettings(color: string, width: number) {
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = color;
      this.canvas.freeDrawingBrush.width = width;
      // Set opacity safely
      const brush = this.canvas.freeDrawingBrush as any;
      if (brush && typeof brush.opacity !== 'undefined') {
        brush.opacity = 1;
      }
    }
  }
  
  /**
   * Add an object to the canvas
   */
  addObject(obj: FabricObject) {
    this.canvas.add(obj);
    this.canvas.renderAll();
  }
  
  /**
   * Set zoom level
   */
  setZoom(zoom: number, point?: Point) {
    if (point) {
      // Use fabric.Point for fabricjs methods
      const fabricPoint = new fabric.Point(point.x, point.y);
      this.canvas.zoomToPoint(fabricPoint, zoom);
    } else {
      this.canvas.setZoom(zoom);
    }
    this.canvas.renderAll();
  }
  
  /**
   * Get the current zoom level
   */
  getZoom(): number {
    return this.canvas.getZoom();
  }
  
  /**
   * Render all objects
   */
  render() {
    this.canvas.renderAll();
  }
  
  /**
   * Clear the canvas
   */
  clear() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.renderAll();
  }
}

// Add the fabric namespace if it doesn't exist
declare global {
  const fabric: any;
}
