
/**
 * Hook for managing the initialization and setup of the straight line tool
 * @module hooks/straightLineTool/useToolInitialization
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';

interface UseToolInitializationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  isActive: boolean;
  snapEnabled: boolean;
  onChange?: (canvas: FabricCanvas) => void;
}

export const useToolInitialization = ({
  fabricCanvasRef,
  tool,
  isActive,
  snapEnabled,
  onChange
}: UseToolInitializationProps) => {
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const { logDrawingEvent } = useDrawingErrorReporting();

  // Initialize the tool when it becomes active
  const initializeTool = useCallback(() => {
    if (isActive && !isToolInitialized) {
      setIsToolInitialized(true);
      
      // Log the initialization event
      logDrawingEvent('Line tool initialized', 'tool-init', {
        tool,
        state: { active: isActive, initialized: true }
      });
      
      // Show toast notification about the tool's status
      toast.success(`Line tool ready! ${snapEnabled ? 'Grid snapping enabled.' : 'Grid snapping disabled.'}`, {
        id: 'line-tool-initialized',
        duration: 3000
      });
      
      // Initialize canvas if needed
      if (fabricCanvasRef.current && onChange) {
        onChange(fabricCanvasRef.current);
      }
      
      return true;
    }
    return false;
  }, [isActive, isToolInitialized, tool, snapEnabled, logDrawingEvent, fabricCanvasRef, onChange]);

  // Reset tool initialization when it becomes inactive
  useEffect(() => {
    if (!isActive && isToolInitialized) {
      setIsToolInitialized(false);
    }
  }, [isActive, isToolInitialized]);

  // Initialize the tool when it first becomes active
  useEffect(() => {
    if (isActive && !isToolInitialized) {
      initializeTool();
    }
  }, [isActive, isToolInitialized, initializeTool]);

  return {
    isToolInitialized,
    initializeTool
  };
};
