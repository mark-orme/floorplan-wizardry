/**
 * Canvas controller loader hook
 * Handles loading and error states for the canvas controller
 * @module canvas/controller/useCanvasControllerLoader
 */

import { useState, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DebugInfoState } from '@/types/DebugInfoState';
import { StrokeTypeLiteral, asStrokeType, Point } from "@/types/floor-plan/unifiedTypes";
import { calculateWallLength } from "@/utils/debug/typeDiagnostics";

/**
 * Timeout duration for loading operations in milliseconds
 */
const LOADING_TIMEOUT = 5000;

/**
 * Number of retries for canvas operations
 */
const MAX_RETRIES = 3;

/**
 * Delay between retries in milliseconds
 */
const RETRY_DELAY = 500;

/**
 * Calculate length between two points
 */
const calculateLength = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Added missing functions
const recalculateGIA = () => {
  // Implementation placeholder
};

const calculateGIA = () => {
  // Implementation placeholder
};

/**
 * Props for the useCanvasControllerLoader hook
 */
interface UseCanvasControllerLoaderProps {
  /** Canvas reference */
  canvasRef: React.RefObject<FabricCanvas | null>;
  /** Debug info state */
  debugInfo: DebugInfoState;
  /** Set debug info function */
  setDebugInfo: (info: Partial<DebugInfoState>) => void;
  /** Set error message function */
  setErrorMessage: (message: string) => void;
}

/**
 * Hook that manages canvas loading states and error handling
 * 
 * @param {UseCanvasControllerLoaderProps} props - Hook props
 * @returns {object} Loading state and error handlers
 */
export const useCanvasControllerLoader = ({
  canvasRef,
  debugInfo,
  setDebugInfo,
  setErrorMessage
}: UseCanvasControllerLoaderProps) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState(0);
  
  // Effect to initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) {
      // Start loading
      setIsLoading(true);
      
      // Set timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (isLoading && retries < MAX_RETRIES) {
          // Retry loading
          setRetries(prev => prev + 1);
          setErrorMessage("Canvas loading timeout, retrying...");
        } else if (retries >= MAX_RETRIES) {
          // Max retries reached
          setIsLoading(false);
          setErrorMessage("Canvas loading failed after multiple attempts.");
          setDebugInfo({
            hasError: true,
            canvasInitialized: false,
            canvasReady: false
          });
        }
      }, LOADING_TIMEOUT);
      
      return () => {
        clearTimeout(timeout);
      };
    } else {
      // Canvas is loaded
      setIsLoading(false);
      setRetries(0);
    }
  }, [canvasRef, isLoading, retries, setDebugInfo, setErrorMessage]);
  
  /**
   * Handle canvas loading error
   * @param {Error} error - Error object
   * @param {string} operation - Operation that failed
   */
  const handleError = (error: Error, operation: string) => {
    console.error(`Canvas ${operation} error:`, error);
    setErrorMessage(`Canvas error (${operation}): ${error.message}`);
    setDebugInfo({
      hasError: true,
      errorMessage: error.message
    });
  };
  
  // Map of allowed stroke types matching StrokeTypeLiteral
  const strokeTypeMap: Record<string, StrokeTypeLiteral> = {
    'line': asStrokeType('line'),
    'wall': asStrokeType('wall'),
    'door': asStrokeType('door'),
    'window': asStrokeType('window'),
    'furniture': asStrokeType('furniture'),
    'annotation': asStrokeType('annotation'),
    'polyline': asStrokeType('polyline'),
    'room': asStrokeType('room'),
    'freehand': asStrokeType('freehand')
  };
  
  const updateDebugInfo = (partialState: Partial<DebugInfoState>) => {
    // Fixed function call syntax
    setDebugInfo(prev => ({ ...prev, canvasInitialized: true, ...partialState }));
  };
  
  return {
    isLoading,
    setIsLoading,
    handleError,
    strokeTypeMap,
    updateDebugInfo,
    recalculateGIA,
    calculateGIA
  };
};
