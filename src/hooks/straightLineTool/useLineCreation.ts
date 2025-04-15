
/**
 * Hook for managing line creation functionality
 * @module hooks/straightLineTool/useLineCreation
 */
import { useCallback } from "react";
import { Line, Text } from "fabric";
import { Point } from "@/types/core/Geometry";

interface UseLineCreationProps {
  lineColor: string;
  lineThickness: number;
}

/**
 * Hook for managing line creation functionality
 */
export const useLineCreation = (props: UseLineCreationProps) => {
  const { lineColor, lineThickness } = props;
  
  /**
   * Create a line object
   */
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const line = new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      strokeUniform: true,
      objectType: 'line'
    });
    
    return line;
  }, [lineColor, lineThickness]);
  
  /**
   * Create a distance tooltip
   */
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number) => {
    const tooltip = new Text(`${distance.toFixed(0)}px`, {
      left: x,
      top: y - 20,
      fontSize: 12,
      fill: '#333',
      selectable: false,
      objectType: 'tooltip'
    });
    
    return tooltip;
  }, []);
  
  /**
   * Update line and tooltip
   */
  const updateLineAndTooltip = useCallback((
    line: Line, 
    tooltip: Text, 
    startPoint: Point, 
    endPoint: Point, 
    setMeasurementData: (data: any) => void
  ) => {
    // Update line
    line.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    // Calculate distance
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update tooltip
    tooltip.set({
      left: startPoint.x + dx / 2,
      top: startPoint.y + dy / 2 - 20,
      text: `${distance.toFixed(0)}px`
    });
    
    // Update measurement data
    setMeasurementData(prev => ({
      ...prev,
      distance: distance
    }));
  }, []);
  
  return {
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip
  };
};
