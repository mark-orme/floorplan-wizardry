
/**
 * Canvas Props Interface
 * Type definitions for canvas component props
 * @module types/canvas/CanvasProps
 */
import { Canvas } from 'fabric';

/**
 * Base canvas component props
 */
export interface BaseCanvasProps {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** CSS class name */
  className?: string;
  /** Called when canvas has been initialized */
  onCanvasReady?: (canvas: Canvas) => void;
  /** Called when canvas fails to initialize */
  onError?: (error: Error) => void;
}

/**
 * Enhanced canvas component props
 */
export interface EnhancedCanvasProps extends BaseCanvasProps {
  /** Whether the canvas is in drawing mode */
  drawingMode?: boolean;
  /** Drawing brush color */
  brushColor?: string;
  /** Drawing brush width */
  brushWidth?: number;
  /** Whether to show performance metrics */
  showPerformanceData?: boolean;
  /** Event callbacks */
  onObjectAdded?: (e: any) => void;
  onObjectModified?: (e: any) => void;
  onObjectRemoved?: (e: any) => void;
}

/**
 * Canvas with grid props
 */
export interface CanvasWithGridProps extends BaseCanvasProps {
  /** Whether to show the grid */
  showGrid?: boolean;
  /** Grid spacing */
  gridSpacing?: number;
  /** Grid color */
  gridColor?: string;
  /** Whether to show grid debug overlay */
  showDebug?: boolean;
}

/**
 * Canvas with persistence props
 */
export interface CanvasWithPersistenceProps extends BaseCanvasProps {
  /** Initial canvas state */
  initialState?: string;
  /** Whether to auto-save canvas state */
  autoSave?: boolean;
  /** Auto-save interval in ms */
  autoSaveInterval?: number;
  /** Called when canvas state changes */
  onStateChange?: (state: string) => void;
}
