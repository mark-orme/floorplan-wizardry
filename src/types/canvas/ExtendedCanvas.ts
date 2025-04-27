
import { Canvas as FabricCanvas, IEvent, Object as FabricObject } from 'fabric';

export interface ExtendedCanvas extends FabricCanvas {
  wrapperEl: HTMLElement;
  upperCanvasEl?: HTMLCanvasElement;
}

export interface FabricEventHandler<T = Event> {
  (e: IEvent<T>): void;
}

export interface FabricObjectEvent {
  target: FabricObject;
}
