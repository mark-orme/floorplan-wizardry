
import { FloorPlanMetadata } from './canvas-types';
import { FabricObject } from 'fabric';

export interface FloorPlan {
  id: string;
  name: string;
  created?: string;
  modified?: string;
  data?: any;
  thumbnail?: string;
  size?: number;
  width?: number;
  height?: number;
  index?: number;
  metadata?: FloorPlanMetadata;
  objects?: FabricObject[];
  canvasData?: string;
}
