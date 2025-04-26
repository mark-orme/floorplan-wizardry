
/**
 * Canvas Controls Types
 * Type definitions for canvas control elements
 * @module types/canvas/canvasControls
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Canvas toolbar button
 */
export interface CanvasToolbarButton {
  id: string;
  label: string;
  icon: React.ElementType;
  tool: DrawingMode;
  tooltip?: string;
  shortcut?: string;
  disabled?: boolean;
}

/**
 * Canvas tools group
 */
export interface CanvasToolsGroup {
  id: string;
  label: string;
  tools: CanvasToolbarButton[];
}

/**
 * Canvas control panel props
 */
export interface CanvasControlsProps {
  canvas: Canvas | null;
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
}

/**
 * Canvas inspector panel props for examining objects
 */
export interface CanvasInspectorProps {
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  onObjectChange: (obj: FabricObject) => void;
}

/**
 * Canvas settings panel props
 */
export interface CanvasSettingsProps {
  canvas: Canvas | null;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}
