
// Fixed type export to avoid conflict
export type { Point } from './core/Point';

// Export other types
export interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  gridSize?: number;
  snapToGrid?: boolean;
  enablePanZoom?: boolean;
  enableHistory?: boolean;
  onObjectAdded?: (object: any) => void;
  onObjectRemoved?: (object: any) => void;
  onSelectionCreated?: (selection: any) => void;
  onSelectionCleared?: () => void;
  onCanvasReady?: (canvas: any) => void;
  onError?: (error: Error) => void;
}

export interface CanvasState {
  objects: any[];
  zoom: number;
  pan: { x: number; y: number };
  activeTool: string;
  selection: any | null;
  history: {
    past: any[];
    future: any[];
  };
  gridVisible: boolean;
  snapToGrid: boolean;
  readOnly: boolean;
  loading: boolean;
  error: Error | null;
}

export interface CanvasAction {
  type: string;
  payload?: any;
}

export interface DrawingToolProps {
  active: boolean;
  color: string;
  width: number;
  opacity: number;
  onComplete?: (object: any) => void;
  onCancel?: () => void;
}

export interface GridProps {
  visible: boolean;
  size: number;
  color: string;
  snapEnabled: boolean;
  opacity: number;
}

export interface CanvasHistory {
  past: any[];
  current: any | null;
  future: any[];
}

export interface CanvasMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
  version: number;
  tags?: string[];
}

export interface CanvasExportOptions {
  format: 'json' | 'svg' | 'png' | 'pdf';
  quality?: number;
  withBackground?: boolean;
  withGrid?: boolean;
  multiplier?: number;
  width?: number;
  height?: number;
}

export interface CanvasImportOptions {
  format: 'json' | 'svg';
  preservePosition?: boolean;
  preserveScale?: boolean;
  replaceContents?: boolean;
}

export interface CanvasContextMenuOptions {
  enabled: boolean;
  items?: any[];
  onItemClick?: (item: string, target: any) => void;
}

export interface CanvasSelectionOptions {
  enabled: boolean;
  selectable?: boolean;
  selectableObjects?: string[];
  multiSelect?: boolean;
  transparentCorners?: boolean;
  cornerColor?: string;
  cornerSize?: number;
  borderColor?: string;
  borderDashArray?: number[];
}

export interface CanvasPerformanceOptions {
  enableCulling?: boolean;
  objectCaching?: boolean;
  renderOnAddRemove?: boolean;
  statefulAnimation?: boolean;
  optimizeTextRendering?: boolean;
}

export interface CanvasAccessibilityOptions {
  enableAccessibility?: boolean;
  includeAriaLabels?: boolean;
  keyboardControls?: boolean;
  tabIndex?: number;
  focusableObjects?: boolean;
}

export type CanvasRenderer = 'canvas' | 'webgl';

export interface CanvasRenderingOptions {
  renderer?: CanvasRenderer;
  enableRetinaScaling?: boolean;
  enableSimplification?: boolean;
  maxCurveSegments?: number;
}
