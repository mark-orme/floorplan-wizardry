
import { Object as FabricObject } from 'fabric';

export interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objects: FabricObject[];
}
