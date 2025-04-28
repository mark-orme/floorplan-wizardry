
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Adapter function to convert between different DrawingMode formats
 */
export function asDrawingTool(mode: DrawingMode): DrawingTool {
  return mode as unknown as DrawingTool;
}

/**
 * Convert drawing tool to string representation
 */
export function drawingToolToString(tool: DrawingTool): string {
  return tool.toString();
}

/**
 * Get display name for a drawing tool
 */
export function getDrawingToolName(tool: DrawingTool): string {
  if (typeof tool === 'string') {
    return tool.charAt(0).toUpperCase() + tool.slice(1).toLowerCase();
  }
  
  return 'Unknown Tool';
}
