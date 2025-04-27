
import { Canvas, Object as FabricObject } from 'fabric';

export interface ExtendedCanvas extends Canvas {
  wrapperEl: HTMLElement;
  upperCanvasEl?: HTMLCanvasElement;
}

export interface FabricEventHandler<T = any> {
  (e: { target: FabricObject }): void;
}

export interface FabricObjectEvent {
  target: FabricObject;
}
