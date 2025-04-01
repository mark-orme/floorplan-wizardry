
/**
 * Custom hook for managing drawing tool state
 * Provides consistent tool handling across the application
 * @module hooks/useDrawingTool
 */
import { useState, useCallback } from 'react';
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Interface for useDrawingTool hook returns
 */
export interface UseDrawingToolResult {
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Set the current drawing tool */
  setTool: (tool: DrawingTool) => void;
  /** Start drawing at a point */
  startDrawing: (point: { x: number; y: number }) => void;
  /** Continue drawing to a point */
  continueDrawing: (point: { x: number; y: number }) => void;
  /** End drawing at a point */
  endDrawing: (point: { x: number; y: number }) => void;
  /** Cancel the current drawing operation */
  cancelDrawing: () => void;
  /** Whether drawing is currently in progress */
  isDrawing: boolean;
  /** Validate if a tool is a valid DrawingTool */
  isValidDrawingTool: (tool: unknown) => boolean;
}

/**
 * Hook for managing drawing tool state and operations
 * 
 * This hook centralizes drawing tool logic by:
 * 1. Maintaining the current tool state (SELECT, DRAW, LINE, etc.)
 * 2. Tracking whether drawing is in progress
 * 3. Validating drawing tool values against the DrawingMode enum
 * 4. Providing consistent drawing operation methods
 * 5. Handling error states and user feedback
 * 
 * Usage example:
 * ```tsx
 * const {
 *   tool,
 *   setTool,
 *   startDrawing,
 *   continueDrawing, 
 *   endDrawing,
 *   isDrawing
 * } = useDrawingTool();
 * 
 * // Set a tool using the DrawingMode enum
 * setTool(DrawingMode.STRAIGHT_LINE);
 * 
 * // Handle drawing operations
 * const handleMouseDown = (e) => {
 *   const point = { x: e.clientX, y: e.clientY };
 *   startDrawing(point);
 * };
 * ```
 * 
 * @returns {UseDrawingToolResult} Drawing tool state and handlers
 */
export function useDrawingTool(): UseDrawingToolResult {
  // Current drawing tool state
  const [tool, setToolState] = useState<DrawingTool>(DrawingMode.SELECT);
  // Drawing in progress state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  /**
   * Validate if a value is a valid DrawingTool
   * 
   * This validation ensures that only valid DrawingMode enum values are used
   * throughout the application, preventing type mismatches and runtime errors.
   * 
   * @param {unknown} value - Value to check
   * @returns {boolean} Whether value is a valid DrawingTool
   */
  const isValidDrawingTool = useCallback((value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    return Object.values(DrawingMode).includes(value as DrawingMode);
  }, []);
  
  /**
   * Set the current drawing tool with validation
   * 
   * This method:
   * 1. Validates the incoming tool against the DrawingMode enum
   * 2. Updates the tool state if valid
   * 3. Provides user feedback with toast notifications
   * 4. Logs tool changes for debugging
   * 
   * @param {DrawingTool} newTool - New drawing tool to set
   */
  const setTool = useCallback((newTool: DrawingTool) => {
    // Validate newTool is a valid DrawingTool
    const isValid = isValidDrawingTool(newTool);
    
    if (isValid) {
      setToolState(newTool);
      // Show success message with tool name
      toast.success(`Changed to ${newTool} tool`);
      logger.info("Tool changed", { previousTool: tool, newTool });
    } else {
      console.warn(`Tool validation failed: ${newTool}`, { expected: Object.values(DrawingMode) });
      logger.error("Invalid drawing tool selected", { invalidTool: newTool, allowedTools: Object.values(DrawingMode) });
      toast.error('Invalid drawing tool selected');
    }
  }, [tool, isValidDrawingTool]);
  
  /**
   * Start drawing at a point
   * 
   * Initiates a drawing operation at the specified coordinates.
   * Sets the isDrawing flag to true, which affects the behavior of other methods.
   * 
   * @param {object} point - Start point coordinates
   */
  const startDrawing = useCallback((point: { x: number; y: number }) => {
    setIsDrawing(true);
    console.log('Started drawing with tool:', tool, 'at point:', point);
  }, [tool]);
  
  /**
   * Continue drawing to a point
   * 
   * Updates an in-progress drawing operation as the pointer moves.
   * Only has an effect if isDrawing is true.
   * 
   * @param {object} point - Current point coordinates
   */
  const continueDrawing = useCallback((point: { x: number; y: number }) => {
    if (!isDrawing) return;
    console.log('Continued drawing to point:', point);
  }, [isDrawing]);
  
  /**
   * End drawing at a point
   * 
   * Completes a drawing operation at the specified coordinates.
   * Resets the isDrawing flag to false.
   * 
   * @param {object} point - End point coordinates
   */
  const endDrawing = useCallback((point: { x: number; y: number }) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    console.log('Ended drawing at point:', point);
  }, [isDrawing]);
  
  /**
   * Cancel the current drawing operation
   * 
   * Aborts an in-progress drawing operation without completing it.
   * Resets the isDrawing flag to false.
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    console.log('Drawing canceled');
  }, [isDrawing]);
  
  return {
    tool,
    setTool,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    isDrawing,
    isValidDrawingTool
  };
}
