
import { FabricCanvas, FabricObject } from '@/types/fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './straightLineTool/useLineInputMethod';

/**
 * Measurement data interface for line tools
 */
export interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped: boolean;
  unit: string;
}

/**
 * Result of the useStraightLineTool hook
 */
export interface UseStraightLineToolResult {
  /** Whether the tool is active */
  isActive: boolean;
  
  /** Whether the tool is enabled */
  isEnabled: boolean;
  
  /** Current line being drawn */
  currentLine: FabricObject | null;
  
  /** Whether the tool is initialized */
  isToolInitialized: boolean;
  
  /** Whether currently drawing */
  isDrawing: boolean;
  
  /** Input method (mouse, touch, pencil) */
  inputMethod: InputMethod;
  
  /** Whether in pencil mode */
  isPencilMode: boolean;
  
  /** Whether snap to grid is enabled */
  snapEnabled: boolean;
  
  /** Whether angle constraints are enabled */
  anglesEnabled: boolean;
  
  /** Current measurement data */
  measurementData: MeasurementData;
  
  /** Toggle grid snapping */
  toggleGridSnapping: () => void;
  
  /** Toggle angle constraints */
  toggleAngles: () => void;
  
  /** Start drawing a line */
  startDrawing: (point: Point) => void;
  
  /** Continue drawing a line */
  continueDrawing: (point: Point) => void;
  
  /** End drawing a line */
  endDrawing: () => void;
  
  /** Cancel drawing */
  cancelDrawing: () => void;
  
  /** Handle pointer down event */
  handlePointerDown: (e: any) => void;
  
  /** Handle pointer move event */
  handlePointerMove: (e: any) => void;
  
  /** Handle pointer up event */
  handlePointerUp: (e: any) => void;
}
