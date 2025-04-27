
import { Canvas, Object as FabricObject } from 'fabric';

export interface ExtendedCanvas extends Canvas {
  wrapperEl: HTMLElement;
  upperCanvasEl?: HTMLCanvasElement;
}

export interface FabricEventHandler<T = Event> {
  (e: { target: FabricObject }): void;
}
