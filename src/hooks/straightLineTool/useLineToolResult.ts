
/**
 * Hook for managing the result of the line tool
 * @module hooks/straightLineTool/useLineToolResult
 */
import { useMemo } from "react";
import { InputMethod } from "./useLineInputMethod";
import { Point } from "@/types/core/Point";

interface UseLineToolResultProps {
  isDrawing: boolean;
  enabled: boolean;
  inputMethod: InputMethod;
  snapEnabled: boolean;
  startPointRef: React.MutableRefObject<any | null>;
  currentLineRef: React.MutableRefObject<any | null>;
  toggleSnap: () => void;
  toggleAngles: () => void;
  cancelDrawing: () => void;
  renderTooltip: () => JSX.Element | null;
  startDrawing?: (point: Point) => void;
  continueDrawing?: (point: Point) => void;
  completeDrawing?: (point: Point) => void;
  measurementData: {
    distance: number | null;
    angle: number | null;
    snapped?: boolean;
    unit?: string;
  };
}

/**
 * Hook for creating the result object for the straight line tool
 */
export const useLineToolResult = (props: UseLineToolResultProps) => {
  const {
    isDrawing,
    enabled,
    inputMethod,
    snapEnabled,
    startPointRef,
    currentLineRef,
    toggleSnap,
    toggleAngles,
    cancelDrawing,
    renderTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    measurementData
  } = props;
  
  // Create the result object
  const result = useMemo(() => ({
    isDrawing,
    isActive: enabled,
    inputMethod,
    isPencilMode: inputMethod === InputMethod.PENCIL,
    snapEnabled,
    anglesEnabled: false,
    measurementData,
    handlePointerDown: (point: Point) => {
      startDrawing?.(point);
    },
    handlePointerMove: (point: Point) => {
      continueDrawing?.(point);
    },
    handlePointerUp: (point: Point) => {
      completeDrawing?.(point);
    },
    cancelDrawing,
    toggleGridSnapping: toggleSnap,
    toggleAngles,
    startPointRef,
    currentLineRef,
    currentLine: currentLineRef.current,
    toggleSnap,
    renderTooltip
  }), [
    isDrawing,
    enabled,
    inputMethod,
    snapEnabled,
    startPointRef,
    currentLineRef,
    toggleSnap,
    toggleAngles,
    cancelDrawing,
    renderTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    measurementData
  ]);
  
  return result;
};
