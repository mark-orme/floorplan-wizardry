
/**
 * Main canvas operations hook
 * Composes smaller, focused hooks for different operation types
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { ExtendedFabricCanvas } from '@/types/fabric-core';

// Define proper interfaces for the operations hooks
interface UseToolOperationsResult {
  tool: DrawingMode;
  updateTool: (tool: DrawingMode) => void;
  handleToolChange?: (tool: DrawingMode) => void;
}

interface UseHistoryOperationsProps {
  canvasComponentRef: React.RefObject<ExtendedFabricCanvas | null>;
  canUndo: boolean;
  canRedo: boolean;
}

interface UseHistoryOperationsResult {
  handleUndo: () => void;
  handleRedo: () => void;
}

interface UseFileOperationsProps {
  canvasComponentRef: React.RefObject<ExtendedFabricCanvas | null>;
}

interface UseFileOperationsResult {
  handleClear: () => void;
  handleSave: () => void;
  handleDelete: () => void;
}

interface UseZoomOperationsProps {
  canvasComponentRef: React.RefObject<ExtendedFabricCanvas | null>;
}

interface UseZoomOperationsResult {
  handleZoom: (zoomIn: boolean) => void;
}

interface UseColorOperationsProps {
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
}

interface UseColorOperationsResult {
  currentColor: string;
  recentColors: string[];
  updateColor: (color: string | null) => void;
  updateSelectedObjectsColor: (color: string) => void;
  handleLineColorChange: (color: string) => void;
  handleLineThicknessChange: (thickness: number) => void;
}

interface UseCanvasRefResult {
  canvasComponentRef: React.RefObject<ExtendedFabricCanvas | null>;
  setCanvasRef: (canvas: ExtendedFabricCanvas | null) => void;
  cleanupCanvas: () => void;
}

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

// Define mock implementation for hooks
const useToolOperations = (): UseToolOperationsResult => ({
  tool: DrawingMode.SELECT,
  updateTool: () => {},
  handleToolChange: (tool) => {}
});

const useHistoryOperations = (props: UseHistoryOperationsProps): UseHistoryOperationsResult => ({
  handleUndo: () => {},
  handleRedo: () => {}
});

const useFileOperations = (props: UseFileOperationsProps): UseFileOperationsResult => ({
  handleClear: () => {},
  handleSave: () => {},
  handleDelete: () => {}
});

const useZoomOperations = (props: UseZoomOperationsProps): UseZoomOperationsResult => ({
  handleZoom: () => {}
});

const useColorOperations = (props: UseColorOperationsProps): UseColorOperationsResult => ({
  currentColor: props.lineColor,
  recentColors: [],
  updateColor: () => {},
  updateSelectedObjectsColor: () => {},
  handleLineColorChange: (color) => {
    props.setLineColor(color);
  },
  handleLineThicknessChange: (thickness) => {
    props.setLineThickness(thickness);
  }
});

const useCanvasRef = ({ setCanvas }: { setCanvas?: (canvas: FabricCanvas | null) => void }): UseCanvasRefResult => ({
  canvasComponentRef: { current: null } as React.RefObject<ExtendedFabricCanvas | null>,
  setCanvasRef: () => {},
  cleanupCanvas: () => {}
});

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
  const toolOperations = useToolOperations();
  
  const handleToolChange = useCallback((newTool: DrawingMode) => {
    toolOperations.updateTool(newTool);
    setTool(newTool);
  }, [setTool, toolOperations]);
  
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
  const colorOperations = useColorOperations({
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness
  });
  
  // Use the properly typed functions from colorOperations
  const handleLineThicknessChange = useCallback((thickness: number) => {
    colorOperations.handleLineThicknessChange(thickness);
  }, [colorOperations]);

  const handleLineColorChange = useCallback((color: string) => {
    colorOperations.handleLineColorChange(color);
  }, [colorOperations]);
  
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
