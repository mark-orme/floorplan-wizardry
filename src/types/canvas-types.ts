
import { Object as FabricObject } from 'fabric';

export interface ExtendedFabricObject extends FabricObject {
  set: (options: Record<string, any>) => any;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export * from './ExtendedFabricCanvas';
