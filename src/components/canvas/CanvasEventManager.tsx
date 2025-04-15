
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, PencilBrush } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useStraightLineTool } from "@/hooks/straightLineTool/useStraightLineTool";
import { useCanvasKeyboardShortcuts } from "@/hooks/canvas/useCanvasKeyboardShortcuts";
import { useApplePencilSupport } from "@/hooks/canvas/useApplePencilSupport";
import { requestOptimizedRender, createSmoothEventHandler, createCompletionHandler } from "@/utils/canvas/renderOptimizer";
import { broadcastFloorPlanUpdate, subscribeSyncChannel, isUpdateFromThisDevice } from "@/utils/syncService";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Props for the CanvasEventManager
 */
interface CanvasEventManagerProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
  onDrawingComplete?: () => void; // Callback for drawing completion
  enableSync?: boolean; // Enable real-time sync
}

/**
 * Manages canvas events and interactions
 */
export const CanvasEventManager = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects,
  onDrawingComplete,
  enableSync = true
}: CanvasEventManagerProps) => {
  // Track last active tool
  const lastToolRef = useRef<DrawingMode>(tool);
  
  // Track if we need to save state
  const needsSaveRef = useRef(false);
  
  // Use Apple Pencil support
  const { 
    isApplePencil,
    adjustedLineThickness,
    processPencilTouchEvent
  } = useApplePencilSupport({
    canvas,
    lineThickness
  });
  
  // Get user information for per-user history tracking
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  // Create a debounced state save function
  const debouncedSaveState = useRef(
    createCompletionHandler(() => {
      saveCurrentState();
      if (onDrawingComplete) {
        onDrawingComplete();
      }
      
      // Broadcast canvas state for real-time sync
      if (enableSync && canvas) {
        try {
          // Create a proper FloorPlan object that complies with the type
          const now = new Date().toISOString();
          const floorPlanData: FloorPlan[] = [{
            id: 'current-canvas',
            name: 'Shared Canvas',
            label: 'Shared Canvas', 
            walls: [],
            rooms: [],
            strokes: [],
            createdAt: now,
            updatedAt: now,
            gia: 0,
            level: 0,
            index: 0,
            canvasData: null,
            canvasJson: JSON.stringify(canvas.toJSON()),
            metadata: {
              createdAt: now,
              updatedAt: now,
              paperSize: 'A4',
              level: 0
            }
          }];
          
          // Pass the user ID with the update for tracking ownership
          broadcastFloorPlanUpdate(floorPlanData, userId);
        } catch (error) {
          console.error('Failed to broadcast canvas update:', error);
        }
      }
    }, 300)
  ).current;
  
  // Initialize straight line tool
  useStraightLineTool({
    fabricCanvasRef: { current: canvas },
    enabled: tool === DrawingMode.STRAIGHT_LINE,
    lineColor,
    // Use pressure-adjusted thickness for Apple Pencil
    lineThickness: isApplePencil ? adjustedLineThickness : lineThickness,
    saveCurrentState: debouncedSaveState
  });
  
  // Initialize keyboard shortcuts
  useCanvasKeyboardShortcuts({
    canvas,
    undo,
    redo,
    deleteSelected: deleteSelectedObjects
  });
  
  // Set up real-time sync
  useEffect(() => {
    if (!canvas || !enableSync) return;
    
    // Subscribe to sync channel for real-time updates
    const channel = subscribeSyncChannel();
    
    // Handle remote updates
    channel.bind('client-floorplan-update', (data: any) => {
      // Skip if this is our own update
      if (isUpdateFromThisDevice(data.deviceId)) {
        return;
      }
      
      try {
        // Get floor plan and canvas data
        const remotePlans = data.floorPlans;
        if (!remotePlans || remotePlans.length === 0) return;
        
        // Apply remote canvas state
        const remoteCanvasJson = remotePlans[0].canvasJson;
        const remoteUserId = data.userId || 'anonymous';
        
        if (remoteCanvasJson) {
          // Keep track of the current selection
          const activeObject = canvas.getActiveObject();
          
          // Load new state, preserving grid
          const gridObjects = canvas.getObjects().filter(obj => 
            (obj as any).objectType === 'grid'
          );
          
          // Apply the remote canvas state
          canvas.loadFromJSON(JSON.parse(remoteCanvasJson), () => {
            // Restore grid objects
            gridObjects.forEach(obj => {
              if (!canvas.contains(obj)) {
                canvas.add(obj);
                canvas.sendToBack(obj);
              }
            });
            
            // Restore selection if possible
            if (activeObject && !canvas.contains(activeObject)) {
              const similarObjects = canvas.getObjects().filter(obj => 
                obj.type === activeObject.type
              );
              if (similarObjects.length > 0) {
                canvas.setActiveObject(similarObjects[0]);
              }
            }
            
            // Render the updated canvas
            requestOptimizedRender(canvas, 'remote-update');
            console.log(`Applied remote canvas update from user ${remoteUserId}`);
          });
        }
      } catch (error) {
        console.error('Error applying remote canvas update:', error);
      }
    });
    
    return () => {
      channel.unbind('client-floorplan-update');
    };
  }, [canvas, enableSync, userId]);
  
  // Set up event listeners
  useEffect(() => {
    if (!canvas) return;
    
    // Clear drawing mode when tool changes
    if (lastToolRef.current !== tool) {
      // If switching from drawing tool, save state
      if (
        lastToolRef.current === DrawingMode.DRAW ||
        lastToolRef.current === DrawingMode.STRAIGHT_LINE
      ) {
        debouncedSaveState();
      }
      
      lastToolRef.current = tool;
    }
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Configure free drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      // Use pressure-adjusted thickness for Apple Pencil
      canvas.freeDrawingBrush.width = isApplePencil ? adjustedLineThickness : lineThickness;
      
      // Improve brush smoothness
      if (canvas.freeDrawingBrush instanceof PencilBrush) {
        // Using type assertion to set the decimate property
        (canvas.freeDrawingBrush as any).decimate = 2;
      }
    }
    
    // Optimized event handlers
    const handlePathCreated = () => {
      requestOptimizedRender(canvas, 'pathCreated');
      debouncedSaveState();
    };
    
    const handleObjectModified = createSmoothEventHandler(() => {
      requestOptimizedRender(canvas, 'objectModified');
      needsSaveRef.current = true;
    }, 100);
    
    const handleObjectAdded = (e: any) => {
      // Don't save state for drawing tools as they already save when path is created
      if (tool !== DrawingMode.DRAW && tool !== DrawingMode.STRAIGHT_LINE) {
        requestOptimizedRender(canvas, 'objectAdded');
        needsSaveRef.current = true;
      }
    };
    
    const handleObjectRemoved = () => {
      requestOptimizedRender(canvas, 'objectRemoved');
      needsSaveRef.current = true;
    };
    
    const handleMouseUp = createCompletionHandler(() => {
      // If we need to save, invoke the callback
      if (needsSaveRef.current) {
        debouncedSaveState();
        needsSaveRef.current = false;
      }
    }, 250);
    
    // Register event listeners
    canvas.on('path:created', handlePathCreated);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('selection:cleared', handleMouseUp);
    
    return () => {
      // Remove event listeners
      canvas.off('path:created', handlePathCreated);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('selection:cleared', handleMouseUp);
    };
  }, [canvas, tool, lineColor, lineThickness, debouncedSaveState, isApplePencil, adjustedLineThickness]);
  
  // Empty render as this is just an event manager
  return null;
};
