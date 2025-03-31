
/**
 * Main canvas operations hook
 * Composes smaller, focused hooks for different operation types
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useToolOperations } from "./useToolOperations";
import { useHistoryOperations } from "./useHistoryOperations";
import { useFileOperations } from "./useFileOperations";
import { useZoomOperations } from "./useZoomOperations";
import { useColorOperations } from "./useColorOperations";
import { useCanvasRef } from "./useCanvasRef";

interface UseCanvasOperationsProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
  tool: DrawingMode;
  setTool: (tool: DrawingMode) => void;
  lineColor: string;
  lineThickness: number;
  setLineColor: (color: string) => void;
  setLineThickness: (thickness: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (canUndo: boolean) => void;
  setCanRedo: (canRedo: boolean) => void;
}

export const useCanvasOperations = ({
  setCanvas,
  tool,
  setTool,
  lineColor,
  lineThickness,
  setLineColor,
  setLineThickness,
  canUndo,
  canRedo,
  setCanUndo,
  setCanRedo,
}: UseCanvasOperationsProps) => {
  // Setup canvas reference management
  const {
    canvasComponentRef,
    setCanvasRef,
    cleanupCanvas
  } = useCanvasRef({ setCanvas });
  
  // Setup tool operations
  const { handleToolChange } = useToolOperations({
    tool,
    setTool
  });
  
  // Setup history operations
  const { handleUndo, handleRedo } = useHistoryOperations({
    canvasComponentRef,
    canUndo,
    canRedo
  });
  
  // Setup file operations
  const { handleClear, handleSave, handleDelete } = useFileOperations({
    canvasComponentRef
  });
  
  // Setup zoom operations
  const { handleZoom } = useZoomOperations({
    canvasComponentRef
  });
  
  // Setup color and thickness operations
  const { 
    handleLineThicknessChange,
    handleLineColorChange
  } = useColorOperations({
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor
  });
  
  return {
    canvasComponentRef,
    setCanvasRef,
    cleanupCanvas,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    handleClear,
    handleSave,
    handleDelete,
    handleLineThicknessChange,
    handleLineColorChange
  };
};
