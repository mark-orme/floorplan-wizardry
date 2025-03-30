
/**
 * Simple Grid utilities
 * Functions for creating and managing a simple grid
 * @module utils/grid/simpleGrid
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

// Re-export from gridBasics for backward compatibility
export { 
  createSimpleGrid, 
  clearGrid, 
  isCanvasValidForGrid 
} from './gridBasics';
