
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
    setActiveObject?(object: Object, options?: any): Canvas;
    zoomToPoint?(point: { x: number, y: number }, value: number): void;
    enableRetinaScaling?: boolean;
    toObject?(): any;
    fire?(eventName: string, options?: any): Canvas;
    add(...objects: Object[]): Canvas;  // Ensure this accepts Object[]
    remove(...objects: Object[]): Canvas;  // Ensure this accepts Object[]
    sendToBack(object: Object): Canvas;  // Ensure this accepts Object
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
    // Fix the 'set' method signature to be compatible with all expected usages
    set(options: Record<string, any>): Object;
    set(property: string, value: any): Object;
    setCoords?(): Object;
    getBoundingRect?(): { left: number; top: number; width: number; height: number };
    setPositionByOrigin?(point: { x: number; y: number }, originX: string, originY: string): void;
    excludeFromExport?(): void;
    toObject?(options?: any): any;
  }

  interface Text extends Object {
    text: string;
    set(options: Record<string, any>): Text;
    set(property: string, value: any): Text;
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
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    stroke?: string;
    strokeWidth?: number;
    data?: any;
    // Ensure Line's set method matches Object's set method
    set(options: Record<string, any>): Line;
    set(property: string, value: any): Line;
  }
  
  export class Text extends Object {
    constructor(text: string, options?: any);
    text: string;
    // Ensure Text's set method matches Object's set method
    set(options: Record<string, any>): Text;
    set(property: string, value: any): Text;
  }
  
  export class PencilBrush {
    color: string;
    width: number;
  }
}
