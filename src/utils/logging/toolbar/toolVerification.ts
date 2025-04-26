
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import * as Sentry from '@sentry/react';
import { Canvas } from 'fabric';

interface VerificationResult {
  connected: boolean;
  issues: string[];
}

interface ExtendedCanvas extends Canvas {
  isDrawingMode?: boolean;
  selection?: boolean;
  freeDrawingBrush?: {
    width: number;
    color: string;
  };
  getObjects?: () => unknown[];
}

/**
 * Verifies toolbar item is properly connected to the canvas
 * @param toolName Name of the tool to verify
 * @param canvas The Fabric.js canvas reference
 * @returns Object indicating if connection is valid
 */
export const verifyToolCanvasConnection = (
  toolName: DrawingMode,
  canvas: ExtendedCanvas | null
): VerificationResult => {
  const issues: string[] = [];
  
  if (!canvas) {
    issues.push("Canvas is null or undefined");
    return { connected: false, issues };
  }
  
  // Check if canvas API is accessible
  if (!canvas.getObjects || typeof canvas.getObjects !== 'function') {
    issues.push("Canvas API is not properly accessible");
  }
  
  // Tool-specific verification
  switch (toolName) {
    case DrawingMode.DRAW:
      if (!canvas.isDrawingMode) {
        issues.push("Canvas drawing mode is not enabled for draw tool");
      }
      if (!canvas.freeDrawingBrush) {
        issues.push("Free drawing brush is not available");
      }
      break;
      
    case DrawingMode.SELECT:
      if (!canvas.selection) {
        issues.push("Canvas selection is not enabled for select tool");
      }
      break;
      
    case DrawingMode.STRAIGHT_LINE:
      // Verify straight line tool requirements
      try {
        const fabricLib = (window as Window & { fabric?: { Line?: unknown } }).fabric;
        if (!fabricLib || !fabricLib.Line) {
          issues.push("fabric.Line constructor is not available");
        }
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        issues.push(`Error testing straight line tool: ${err}`);
      }
      break;
      
    case DrawingMode.WALL:
    case DrawingMode.RECTANGLE:
    case DrawingMode.CIRCLE:
    case DrawingMode.ERASER:
      // Tool-specific checks could be added here
      break;
  }
  
  // Log issues if any were found
  if (issues.length > 0) {
    logger.warn(`Tool verification issues for ${toolName}:`, { issues });
    
    Sentry.addBreadcrumb({
      category: 'toolbar',
      message: `Tool connection issues: ${toolName}`,
      level: 'warning',
      data: { tool: toolName, issues }
    });
  }
  
  return {
    connected: issues.length === 0,
    issues
  };
};
