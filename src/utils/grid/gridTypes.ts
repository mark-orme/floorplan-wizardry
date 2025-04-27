
import { Object as FabricObject } from 'fabric';

/**
 * Grid line type with grid-specific properties
 */
export interface GridLine extends FabricObject {
  gridObject?: boolean;
  gridType?: 'horizontal' | 'vertical' | 'horizontalMajor' | 'verticalMajor';
  visible?: boolean;
}

/**
 * Grid options for customizing grid appearance
 */
export interface GridOptions {
  spacing?: number;
  color?: string;
  opacity?: number;
  strokeWidth?: number;
  visible?: boolean;
  majorSpacing?: number;
  majorColor?: string;
  majorOpacity?: number;
  majorStrokeWidth?: number;
}
