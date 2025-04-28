
import type { Canvas } from 'fabric';

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
  
  /** Additional methods that might be needed by components */
  getActiveObject?: () => any;
}

export type { ExtendedFabricObject } from '@/types/canvas-types';
