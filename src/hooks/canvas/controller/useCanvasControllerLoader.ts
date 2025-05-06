
import { useState, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { reportError } from "@/utils/errorReporting";

// Define the DebugInfoState interface
export interface DebugInfoState {
  canvasReady?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  mousePosition?: { x: number; y: number };
  zoomLevel?: number;
}

interface UseCanvasControllerLoaderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  debugInfo: DebugInfoState;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Canvas controller loader hook
 * Handles loading and error states for the canvas controller
 */
export const useCanvasControllerLoader = ({
  canvasRef,
  debugInfo,
  setDebugInfo,
  setErrorMessage
}: UseCanvasControllerLoaderProps) => {
  const canvasDimensions = { width: 800, height: 600 };
  const historyRef = useRef<{ past: any[], future: any[] }>({ past: [], future: [] });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize logging
  const logError = (message: string) => {
    console.error(message);
    reportError(message, { context: 'canvas-controller' });
  };
  
  const logInfo = (message: string) => {
    console.info(message);
  };
  
  // Handle errors
  const handleError = (error: Error, operation: string = '') => {
    const errorMessage = `Canvas ${operation ? `(${operation})` : ''}: ${error.message}`;
    logError(errorMessage);
    setErrorMessage(errorMessage);
    setDebugInfo(prev => ({
      ...prev,
      canvasReady: false,
      hasError: true,
      errorMessage: error.message
    }));
  };
  
  // Log information
  logInfo('Canvas controller loader initialized');
  
  return {
    isLoading,
    setIsLoading,
    handleError,
    historyRef,
    canvasDimensions
  };
};
