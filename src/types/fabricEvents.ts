
export interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer: { x: number; y: number };
  target?: any;
}
