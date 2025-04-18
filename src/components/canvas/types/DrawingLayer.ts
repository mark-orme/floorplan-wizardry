
import { Object as FabricObject } from 'fabric';

export interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color?: string;
  type?: 'internal' | 'external' | 'extension' | 'note' | 'measurement';
  objects: FabricObject[];
}

