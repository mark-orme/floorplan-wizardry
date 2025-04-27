
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createFabricLine } from '@/types/fabric-extended';
import type { ExtendedFabricObject } from '@/types/fabric-extended';
import { SMALL_GRID_SIZE, SMALL_GRID_COLOR, LARGE_GRID_COLOR, SMALL_GRID_WIDTH, LARGE_GRID_WIDTH } from '@/constants/gridConstants';

export const GRID_CONSTANTS = {
  SMALL: {
    WIDTH: SMALL_GRID_WIDTH
  },
  LARGE: {
    WIDTH: LARGE_GRID_WIDTH
  }
};

export class SimpleGrid {
  canvas: FabricCanvas;
  gridObjects: ExtendedFabricObject[] = [];
  spacing: number;
  smallColor: string;
  largeColor: string;
  smallWidth: number;
  largeWidth: number;
  largeSpacingMultiplier: number;
  
  constructor(
    canvas: FabricCanvas,
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
    this.smallWidth = options.smallWidth || SMALL_GRID_WIDTH;
    this.largeWidth = options.largeWidth || LARGE_GRID_WIDTH;
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
      const line = createFabricLine([x, 0, x, height], {
        stroke: isLargeLine ? this.largeColor : this.smallColor,
        strokeWidth: isLargeLine ? this.largeWidth : this.smallWidth,
        selectable: false,
        evented: false
      }) as ExtendedFabricObject;
      
      this.canvas.add(line);
      this.gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += this.spacing) {
      const isLargeLine = y % (this.spacing * this.largeSpacingMultiplier) === 0;
      const line = createFabricLine([0, y, width, y], {
        stroke: isLargeLine ? this.largeColor : this.smallColor,
        strokeWidth: isLargeLine ? this.largeWidth : this.smallWidth,
        selectable: false,
        evented: false
      }) as ExtendedFabricObject;
      
      this.canvas.add(line);
      this.gridObjects.push(line);
    }
    
    // Send grid to back
    this.sendToBack();
    
    return this.gridObjects;
  }
  
  setVisible(visible: boolean) {
    this.gridObjects.forEach(obj => {
      obj.set({ visible });
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
