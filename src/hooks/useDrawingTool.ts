
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
   * @param {object} point - Start point coordinates
   */
  const startDrawing = useCallback((point: { x: number; y: number }) => {
    setIsDrawing(true);
    console.log('Started drawing with tool:', tool, 'at point:', point);
  }, [tool]);
  
  /**
   * Continue drawing to a point
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
   * @param {object} point - End point coordinates
   */
  const endDrawing = useCallback((point: { x: number; y: number }) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    console.log('Ended drawing at point:', point);
  }, [isDrawing]);
  
  /**
   * Cancel the current drawing operation
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
