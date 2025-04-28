
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Extended Fabric object with custom properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  isGrid?: boolean;
  isLargeGrid?: boolean;
  wrapperEl?: HTMLDivElement;
}

/**
 * Extended Fabric canvas with additional properties needed for our application
 */
export interface ExtendedFabricCanvas extends Canvas {
  wrapperEl: HTMLDivElement; 
  skipTargetFind: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  fire?: (eventName: string, options?: any) => Canvas;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  getActiveObject?: () => FabricObject | null;
  viewportTransform?: number[];
  initialize?: () => void;
  _activeObject?: FabricObject | null;
  _objects?: FabricObject[];
}

/**
 * Helper function to safely cast a Fabric Canvas to our extended type
 */
export function asExtendedCanvas(canvas: Canvas): ExtendedFabricCanvas {
  return canvas as unknown as ExtendedFabricCanvas;
}
