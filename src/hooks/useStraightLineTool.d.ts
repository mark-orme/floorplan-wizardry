
import { FabricCanvas, FabricObject } from '@/types/fabric';

/**
 * Result of the useStraightLineTool hook
 */
export interface UseStraightLineToolResult {
  /** Whether the tool is active */
  isActive: boolean;
  
  /** Current line being drawn */
  currentLine: FabricObject | null;
  
  /** Whether the tool is initialized */
  isToolInitialized: boolean;
  
  /** Whether currently drawing */
  isDrawing: boolean;
  
  /** Start drawing a line */
  startDrawing: (canvas: FabricCanvas, pointer: { x: number, y: number }) => void;
  
  /** Continue drawing a line */
  continueDrawing: (canvas: FabricCanvas, pointer: { x: number, y: number }) => void;
  
  /** End drawing a line */
  endDrawing: (canvas: FabricCanvas) => void;
  
  /** Cancel drawing */
  cancelDrawing: (canvas: FabricCanvas) => void;
}
