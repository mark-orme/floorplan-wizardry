
export interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer: { x: number; y: number };
  target?: any;
}

export interface FabricCanvasMouseEvent {
  e: MouseEvent;
  pointer: { x: number; y: number };
  target?: any;
  absolutePointer?: { x: number; y: number };
}

export interface FabricMouseEvent extends FabricCanvasMouseEvent {}
