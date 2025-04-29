
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
}
