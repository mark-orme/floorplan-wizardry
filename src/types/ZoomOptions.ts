
/**
 * Zoom options configuration
 */
export interface ZoomOptions {
  /** Direction to zoom */
  direction: 'in' | 'out';
  /** Zoom factor */
  factor?: number;
  /** Zoom center point */
  point?: { x: number; y: number };
}
