
import { Canvas as FabricCanvasType, Object as FabricObject } from 'fabric';

declare global {
  namespace fabric {
    interface Canvas extends FabricCanvasType {
      isDrawingMode: boolean;
      selection: boolean;
      defaultCursor: string;
      hoverCursor: string;
      freeDrawingBrush: {
        color: string;
        width: number;
      };
      on(eventName: string, handler: Function): void;
      off(eventName: string, handler: Function): void;
      renderAll(): void;
      requestRenderAll(): void;
      setWidth(width: number): void;
      setHeight(height: number): void;
    }
    
    interface Object extends FabricObject {
      gridObject?: boolean;
      selectable: boolean;
      evented?: boolean;
    }
  }
}

export {};
