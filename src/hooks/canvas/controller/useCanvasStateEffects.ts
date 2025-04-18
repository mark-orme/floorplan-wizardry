
/**
 * Hook for managing canvas side effects and Sentry tracking
 */
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/types/canvasStateTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import * as Sentry from '@sentry/react';

interface UseCanvasStateEffectsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number; 
  lineColor: string;
  floorPlans: FloorPlan[];
  currentFloor: number;
  isPusherConnected?: boolean;
  snapEnabled?: boolean;
}

export const useCanvasStateEffects = ({
  fabricCanvasRef,
  gridLayerRef,
  tool,
  zoomLevel,
  lineThickness,
  lineColor,
  floorPlans,
  currentFloor,
  isPusherConnected,
  snapEnabled
}: UseCanvasStateEffectsProps) => {
  // Set up Sentry context for the component and tool usage
  useEffect(() => {
    Sentry.setTag("component", "CanvasToolsManager");
    Sentry.setTag("tool", tool);
    Sentry.setTag("zoomLevel", zoomLevel.toString());
    
    Sentry.setContext("toolState", {
      currentTool: tool,
      lineThickness,
      lineColor,
      zoomLevel,
      timestamp: new Date().toISOString()
    });
    
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      Sentry.setContext("canvas", {
        objectCount: canvas.getObjects().length,
        width: canvas.width,
        height: canvas.height,
        selection: canvas.selection,
        isDrawingMode: canvas.isDrawingMode,
        gridObjects: gridLayerRef.current?.length || 0
      });
    }
    
    Sentry.setContext("floorPlans", {
      count: floorPlans.length,
      currentFloor,
      currentFloorName: floorPlans[currentFloor]?.name || 'unknown'
    });
    
    return () => {
      Sentry.setTag("component", null);
      Sentry.setTag("tool", null);
      Sentry.setTag("zoomLevel", null);
    };
  }, [tool, zoomLevel, lineThickness, lineColor, fabricCanvasRef, gridLayerRef, floorPlans, currentFloor]);

  // Track snap state changes
  useEffect(() => {
    if (typeof snapEnabled !== 'undefined') {
      Sentry.addBreadcrumb({
        category: 'grid',
        message: `Grid snap ${snapEnabled ? 'enabled' : 'disabled'}`,
        level: 'info',
        data: {
          snapEnabled,
          tool,
          currentZoom: zoomLevel
        }
      });
      
      Sentry.setTag("gridSnap", snapEnabled.toString());
    }
  }, [snapEnabled, tool, zoomLevel]);

  // Update Sentry context whenever Pusher connection changes
  useEffect(() => {
    if (typeof isPusherConnected !== 'undefined') {
      Sentry.setTag("pusherConnected", isPusherConnected.toString());
      
      Sentry.setContext("realtime", {
        pusherConnected: isPusherConnected,
        timestamp: new Date().toISOString()
      });
    }
  }, [isPusherConnected]);
};
