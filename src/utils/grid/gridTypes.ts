
import { fabric } from 'fabric';

export type GridLine = fabric.Line;

export interface GridOptions {
  size: number;
  color: string;
  majorSize: number;
  majorColor: string;
  opacity: number;
  majorOpacity: number;
}

export interface GridState {
  visible: boolean;
  options: GridOptions;
  objects: GridLine[];
}
