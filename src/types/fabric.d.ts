
import { Canvas as FabricCanvas } from 'fabric';

declare global {
  interface HTMLCanvasElement {
    _fabric?: FabricCanvas;
  }
  
  interface Window {
    fabricCanvasInstances?: FabricCanvas[];
  }
}

export interface CanvasCreationOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  selection?: boolean;
  renderOnAddRemove?: boolean;
  stateful?: boolean;
  fireRightClick?: boolean;
  stopContextMenu?: boolean;
  enableRetinaScaling?: boolean;
  skipOffscreen?: boolean;
}

export interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvas?: FabricCanvas | null; // Add this property to fix the type error
}

export interface GridDimensions {
  spacing: number;
  width: number;
  height: number;
}

export interface GridRenderResult {
  gridObjects: any[];
  addToCanvas: boolean;
}

export interface CustomTouchEvent extends TouchEvent {
  clientX?: number;
  clientY?: number;
}

export interface CustomFabricTouchEvent {
  touches: TouchList;
  e?: TouchEvent;
}

export interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer: { x: number; y: number };
  absolutePointer?: { x: number; y: number };
  scenePoint?: { x: number; y: number };
  viewportPoint?: { x: number; y: number };
}
