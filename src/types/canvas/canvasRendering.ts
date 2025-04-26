
/**
 * Canvas Rendering Types
 * Type definitions for canvas rendering settings
 * @module types/canvas/canvasRendering
 */
import { Canvas } from 'fabric';

/**
 * Canvas rendering options
 */
export interface CanvasRenderingOptions {
  /** Enable high quality rendering */
  highQuality?: boolean;
  /** Enable canvas virtualization for performance */
  virtualized?: boolean;
  /** Maximum frames per second */
  maxFps?: number;
  /** Enable retina scaling */
  enableRetinaScaling?: boolean;
}

/**
 * Canvas rendering statistics
 */
export interface CanvasRenderingStats {
  /** Frames per second */
  fps: number;
  /** Time of last render in ms */
  lastRenderTime: number;
  /** Duration of last render in ms */
  renderDuration: number;
  /** Number of objects rendered */
  renderedObjectCount: number;
  /** Whether rendering is throttled */
  throttled: boolean;
}

/**
 * Canvas rendering controller
 */
export interface CanvasRenderingController {
  /** Start rendering */
  start: () => void;
  /** Stop rendering */
  stop: () => void;
  /** Pause rendering */
  pause: () => void;
  /** Resume rendering */
  resume: () => void;
  /** Request a single render frame */
  requestFrame: () => void;
  /** Current rendering statistics */
  stats: CanvasRenderingStats;
  /** Whether rendering is active */
  isActive: boolean;
}

/**
 * Hook for controlling canvas rendering
 */
export type UseCanvasRendering = (
  canvas: Canvas | null, 
  options?: CanvasRenderingOptions
) => CanvasRenderingController;
