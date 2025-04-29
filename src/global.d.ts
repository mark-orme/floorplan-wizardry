
// src/global.d.ts
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
}
