
/**
 * Hook for managing the result of the line tool
 * @module hooks/straightLineTool/useLineToolResult
 */
import { useMemo } from "react";
import { InputMethod } from "./useLineInputMethod";

interface UseLineToolResultProps {
  isDrawing: boolean;
  enabled: boolean;
  inputMethod: InputMethod;
  snapEnabled: boolean;
  startPointRef: React.MutableRefObject<any | null>;
  currentLineRef: React.MutableRefObject<any | null>;
  toggleSnap: () => void;
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
    toggleSnap
  } = props;
  
  // Create the result object
  const result = useMemo(() => ({
    isDrawing,
    isActive: enabled,
    inputMethod,
    isPencilMode: inputMethod === InputMethod.PENCIL,
    snapEnabled,
    anglesEnabled: false,
    measurementData: {
      distance: null,
      angle: null
    },
    handlePointerDown: (point: any) => {
      //console.log('Pointer down at', point);
    },
    handlePointerMove: (point: any) => {
      //console.log('Pointer move to', point);
    },
    handlePointerUp: (point: any) => {
      //console.log('Pointer up at', point);
    },
    cancelDrawing: () => {
      //console.log('Drawing cancelled');
    },
    toggleGridSnapping: () => {
      toggleSnap();
    },
    toggleAngles: () => {
      //console.log('Angles toggled');
    },
    startPointRef,
    currentLineRef,
    currentLine: currentLineRef.current
  }), [
    isDrawing,
    enabled,
    inputMethod,
    snapEnabled,
    startPointRef,
    currentLineRef,
    toggleSnap
  ]);
  
  return result;
};
