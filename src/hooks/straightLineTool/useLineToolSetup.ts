
/**
 * Hook for managing straight line tool setup and initialization
 * @module hooks/straightLineTool/useLineToolSetup
 */
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { InputMethod } from './useLineState';

interface UseLineToolSetupProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isActive: boolean;
  isDrawing: boolean;
  tool: DrawingMode;
  initializeTool: () => boolean;
  handleFabricMouseDown: (e: any) => void;
  handleFabricMouseMove: (e: any) => void;
  handleFabricMouseUp: (e: any) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  lineColor: string;
  lineThickness: number;
  snapToAngle: boolean;
  snapAngleDeg: number;
  inputMethod: InputMethod;
}

/**
 * Hook for setting up the straight line tool's event listeners and initialization
 */
export const useLineToolSetup = ({
  fabricCanvasRef,
  isActive,
  isDrawing,
  tool,
  initializeTool,
  handleFabricMouseDown,
  handleFabricMouseMove,
  handleFabricMouseUp,
  handleKeyDown,
  lineColor,
  lineThickness,
  snapToAngle,
  snapAngleDeg,
  inputMethod
}: UseLineToolSetupProps) => {
  // Track if the tool has been initialized
  const isToolInitializedRef = useRef<boolean>(false);

  // Set up canvas event handlers when tool becomes active
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // Only set up handlers when tool is active
    if (!isActive) {
      isToolInitializedRef.current = false;
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Initialize tool if needed
    if (!isToolInitializedRef.current) {
      initializeTool();
      isToolInitializedRef.current = true;
      
      // Log initialization with context
      logger.info("Tool initialized", { 
        tool,
        isActive,
        lineColor,
        lineThickness,
        snapToAngle,
        snapAngleDeg,
        inputMethod
      });
    }
    
    // Add fabric canvas event listeners
    canvas.on('mouse:down', handleFabricMouseDown);
    canvas.on('mouse:move', handleFabricMouseMove);
    canvas.on('mouse:up', handleFabricMouseUp);
    
    // Handle escape key to cancel drawing
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function
    return () => {
      canvas.off('mouse:down', handleFabricMouseDown);
      canvas.off('mouse:move', handleFabricMouseMove);
      canvas.off('mouse:up', handleFabricMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    fabricCanvasRef, 
    isActive, 
    initializeTool, 
    handleFabricMouseDown, 
    handleFabricMouseMove, 
    handleFabricMouseUp, 
    handleKeyDown,
    lineColor,
    lineThickness,
    snapToAngle,
    snapAngleDeg,
    tool,
    inputMethod
  ]);

  return {
    isToolInitialized: isToolInitializedRef.current
  };
};
