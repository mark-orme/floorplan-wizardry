
// Add missing window property types
interface Window {
  __app_state?: Record<string, unknown>;
  __canvas_state?: Record<string, unknown>;
}

// Add fabric namespace
declare namespace fabric {
  export class ActiveSelection {
    constructor(objects: any[], options?: any);
    forEachObject(callback: (obj: any) => void): void;
  }

  export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
  }
}
