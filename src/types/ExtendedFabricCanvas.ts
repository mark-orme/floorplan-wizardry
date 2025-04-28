
import { Canvas } from 'fabric';

// Define extended fabric canvas type with required properties
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLDivElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
  allowTouchScrolling?: boolean;
}

/**
 * Helper to cast a standard Canvas to our extended type
 */
export const asExtendedCanvas = (canvas: Canvas): ExtendedFabricCanvas => {
  return canvas as ExtendedFabricCanvas;
};
