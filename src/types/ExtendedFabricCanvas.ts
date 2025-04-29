
import type { Canvas, Object as FabricObject } from 'fabric';

/**
 * Extended fabric canvas type with additional properties 
 */
export interface ExtendedFabricCanvas extends Canvas {
  /** The DIV wrapper for sizing/DOM events */
  wrapperEl?: HTMLDivElement;

  /** Optional helpers your hooks use */
  initialize?: () => void;
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  viewportTransform?: number[];
  
  /** Additional methods that might be needed by components */
  getActiveObject?: () => any;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
}

export type { ExtendedFabricObject } from '@/types/canvas-types';
