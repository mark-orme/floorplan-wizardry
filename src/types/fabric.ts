
/**
 * Fabric.js related type definitions
 * @module types/fabric
 */

/**
 * Canvas creation options for Fabric.js
 * @interface CanvasCreationOptions
 */
export interface CanvasCreationOptions {
  /** Canvas width in pixels */
  width: number;
  
  /** Canvas height in pixels */
  height: number;
  
  /** Background color of the canvas */
  backgroundColor?: string;
  
  /** Whether to enable retina scaling */
  enableRetinaScaling?: boolean;
  
  /** Whether to stop context menu on right click */
  stopContextMenu?: boolean;
  
  /** Whether to fire right click events */
  fireRightClick?: boolean;
  
  /** Whether to render on add/remove operations */
  renderOnAddRemove?: boolean;
  
  /** Whether to enable pointer events */
  enablePointerEvents?: boolean;
  
  /** Whether to skip target finding */
  skipTargetFind?: boolean;
  
  /** Whether to enable per-pixel target finding */
  perPixelTargetFind?: boolean;
  
  /** Tolerance for target finding */
  targetFindTolerance?: number;
  
  /** Whether the canvas is interactive */
  interactive?: boolean;
}
