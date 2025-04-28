
import { Canvas } from 'fabric';
import { ExtendedFabricCanvas } from '../canvas-types';

/**
 * @deprecated Use ExtendedFabricCanvas from '@/types/canvas-types' instead
 */
export interface ExtendedCanvas extends ExtendedFabricCanvas {
  // Kept for backward compatibility
  wrapperEl: HTMLElement;
  initialize: () => void;
  skipTargetFind: boolean;
  _activeObject: any;
  _objects: any[];
}

export interface FabricEventHandler<T = any> {
  (e: { target: T }): void;
}

export interface FabricObjectEvent {
  target: any;
}
