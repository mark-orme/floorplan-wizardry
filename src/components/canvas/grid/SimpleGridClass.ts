
import { Canvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS, SMALL_GRID_SIZE, SMALL_GRID_COLOR, LARGE_GRID_COLOR } from '@/constants/gridConstants';

export class SimpleGrid {
  canvas: Canvas;
  gridObjects: FabricObject[] = [];
  spacing: number;
  smallColor: string;
  largeColor: string;
  smallWidth: number;
  largeWidth: number;
  largeSpacingMultiplier: number;
  
  constructor(
    canvas: Canvas,
    options: {
      spacing?: number;
      smallColor?: string;
      largeColor?: string;
      smallWidth?: number;
      largeWidth?: number;
      largeSpacingMultiplier?: number;
    } = {}
  ) {
    this.canvas = canvas;
    this.spacing = options.spacing || SMALL_GRID_SIZE;
    this.smallColor = options.smallColor || SMALL_GRID_COLOR;
    this.largeColor = options.largeColor || LARGE_GRID_COLOR;
    this.smallWidth = options.smallWidth || GRID_CONSTANTS.SMALL.WIDTH;
    this.largeWidth = options.largeWidth || GRID_CONSTANTS.LARGE.WIDTH;
    this.largeSpacingMultiplier = options.largeSpacingMultiplier || 5;
  }
  
  create() {
    // Clean up any existing grid
    this.destroy();
    
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    
    // Create vertical lines
    for (let x = 0; x <= width; x += this.spacing) {
      const isLargeLine = x % (this.spacing * this.largeSpacingMultiplier) === 0;
      const line = new fabric.Line([x, 0, x, height], {
        stroke: isLargeLine ? this.largeColor : this.smallColor,
        strokeWidth: isLargeLine ? this.largeWidth : this.smallWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isLargeGrid: isLargeLine
      });
      
      this.canvas.add(line);
      this.gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += this.spacing) {
      const isLargeLine = y % (this.spacing * this.largeSpacingMultiplier) === 0;
      const line = new fabric.Line([0, y, width, y], {
        stroke: isLargeLine ? this.largeColor : this.smallColor,
        strokeWidth: isLargeLine ? this.largeWidth : this.smallWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true,
        isLargeGrid: isLargeLine
      });
      
      this.canvas.add(line);
      this.gridObjects.push(line);
    }
    
    // Send grid to back
    this.sendToBack();
    
    return this.gridObjects;
  }
  
  setVisible(visible: boolean) {
    this.gridObjects.forEach(obj => {
      if (obj && typeof obj.set === 'function') {
        obj.set('visible', visible);
      }
    });
    
    this.canvas.requestRenderAll();
  }
  
  sendToBack() {
    this.gridObjects.forEach(obj => {
      this.canvas.sendToBack(obj);
    });
  }
  
  destroy() {
    this.gridObjects.forEach(obj => {
      this.canvas.remove(obj);
    });
    
    this.gridObjects = [];
  }
  
  update() {
    this.destroy();
    this.create();
  }
}
