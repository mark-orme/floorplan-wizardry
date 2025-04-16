
/**
 * Hook for setting up the line tool
 * @module hooks/straightLineTool/useLineToolSetup
 */
import { useState, useCallback, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/types/core/Point";
import { InputMethod } from "./useLineInputMethod";

interface UseLineToolSetupProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
}

/**
 * Hook for initializing and setting up the line tool
 */
export const useLineToolSetup = ({ canvas, enabled }: UseLineToolSetupProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  
  /**
   * Activate the line tool
   */
  const activateTool = useCallback(() => {
    if (!canvas) return;
    
    setIsActive(true);
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
  }, [canvas]);
  
  /**
   * Deactivate the line tool
   */
  const deactivateTool = useCallback(() => {
    if (!canvas) return;
    
    setIsActive(false);
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'default';
  }, [canvas]);
  
  /**
   * Handle tool activation/deactivation when enabled changes
   */
  useEffect(() => {
    if (enabled) {
      activateTool();
    } else {
      deactivateTool();
    }
    
    return () => {
      deactivateTool();
    };
  }, [enabled, activateTool, deactivateTool]);
  
  return {
    isActive,
    isDrawing,
    startPoint,
    currentPoint,
    inputMethod,
    setIsDrawing,
    setStartPoint,
    setCurrentPoint,
    setInputMethod,
    activateTool,
    deactivateTool
  };
};
