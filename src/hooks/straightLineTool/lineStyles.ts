
/**
 * Line styles utilities
 * @module hooks/straightLineTool/lineStyles
 */
import { Line } from 'fabric';

export interface LineStyleOptions {
  color: string;
  thickness: number;
  dashed?: boolean;
  dashArray?: number[];
  selectable?: boolean;
  opacity?: number;
}

/**
 * Apply styles to a line
 * @param line Line object
 * @param styles Style options
 */
export function applyLineStyles(
  line: Line | null,
  styles: LineStyleOptions
): void {
  if (!line) return;
  
  line.set({
    stroke: styles.color,
    strokeWidth: styles.thickness,
    strokeDashArray: styles.dashed ? styles.dashArray || [5, 5] : undefined,
    selectable: styles.selectable !== undefined ? styles.selectable : true,
    opacity: styles.opacity !== undefined ? styles.opacity : 1
  });
}

/**
 * Create default line style options
 * @returns Default line style options
 */
export function getDefaultLineStyles(): LineStyleOptions {
  return {
    color: '#000000',
    thickness: 2,
    dashed: false,
    selectable: true,
    opacity: 1
  };
}

/**
 * Apply hover styles to a line
 * @param line Line object
 */
export function applyHoverStyles(line: Line | null): void {
  if (!line) return;
  
  const originalStroke = line.stroke;
  const originalStrokeWidth = line.strokeWidth;
  
  line.set({
    stroke: '#0066ff',
    strokeWidth: originalStrokeWidth ? originalStrokeWidth + 1 : 3
  });
  
  // Store original values for restoration
  line.data = {
    ...line.data,
    originalStroke,
    originalStrokeWidth
  };
}

/**
 * Restore original styles after hover
 * @param line Line object
 */
export function restoreOriginalStyles(line: Line | null): void {
  if (!line || !line.data) return;
  
  line.set({
    stroke: line.data.originalStroke || line.stroke,
    strokeWidth: line.data.originalStrokeWidth || line.strokeWidth
  });
}
