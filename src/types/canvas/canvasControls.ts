
/**
 * Canvas controls type definitions
 * @module types/canvas/canvasControls
 */

export interface ControlOptions {
  visible: boolean;
  size: number;
  padding: number;
  offsetX: number;
  offsetY: number;
  touchSizeMultiplier: number;
  render: (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) => void;
  cornerSize: number;
  cornerStyle: 'circle' | 'rect';
  cornerColor: string;
  cornerStrokeColor: string;
  cornerDashArray: number[] | null;
  transparentCorners: boolean;
  hasControls: boolean;
  hasBorders: boolean;
  borderColor: string;
  borderDashArray: number[] | null;
  borderOpacityWhenMoving: number;
  borderScaleFactor: number;
  borderWidth: number;
}

export interface ObjectControlSettings {
  tl: boolean;
  tr: boolean;
  bl: boolean;
  br: boolean;
  ml: boolean;
  mt: boolean;
  mr: boolean;
  mb: boolean;
  mtr: boolean;
}

export interface CanvasControlAction {
  type: 'select' | 'deselect' | 'move' | 'scale' | 'rotate';
  target: any;
  pointer: { x: number; y: number };
  transform?: any;
}
