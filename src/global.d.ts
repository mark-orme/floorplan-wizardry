
import 'fabric';

declare module 'fabric' {
  interface Canvas {
    wrapperEl: HTMLDivElement;
    renderOnAddRemove?: boolean;
    allowTouchScrolling?: boolean;
    skipTargetFind?: boolean;
    skipOffscreen?: boolean;
    viewportTransform?: number[];
    forEachObject?(callback: (obj: any) => void): void;
    setViewportTransform?(transform: number[]): void;
    getActiveObject?(): any;
    zoomToPoint?(point: { x: number, y: number }, value: number): void;
    enableRetinaScaling?: boolean;
    toObject?(): any;
  }

  interface Object {
    id?: string;
    objectType?: string;
    isGrid?: boolean;
    isLargeGrid?: boolean;
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    visible?: boolean;
    selectable?: boolean;
    evented?: boolean;
    type?: string;
    set?(options: Record<string, any>): Object;
    setCoords?(): Object;
    getBoundingRect?(): { left: number; top: number; width: number; height: number };
    setPositionByOrigin?(point: { x: number; y: number }, originX: string, originY: string): void;
  }

  export class ActiveSelection extends Object {
    forEachObject(callback: (obj: Object) => void): void;
  }

  export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(point: Point): Point;
    subtract(point: Point): Point;
    multiply(scalar: number): Point;
    divide(scalar: number): Point;
  }

  // Export Canvas and Line from fabric
  export const Canvas: any;
  
  // Ensure Line is properly exported and extends Object
  export class Line extends Object {
    constructor(points: number[], options?: any);
  }
}
