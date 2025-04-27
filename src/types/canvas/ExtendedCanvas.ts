
import { Canvas } from 'fabric';

export interface ExtendedCanvas extends Canvas {
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
