import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Path } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { useObjectEvents } from './useObjectEvents';
import { usePathEvents } from './usePathEvents';
import { useBrushSettings } from './useBrushSettings';
import { useZoomTracking } from './useZoomTracking';
import { useKeyboardEvents } from './useKeyboardEvents';
import { useMouseEvents } from './useMouseEvents';
import { EventHandlerResult, CanvasEventHandlerMap } from './types';
import { useCanvasHandlers } from './useCanvasHandlers';
import { asExtendedCanvas, asExtendedObject } from '@/utils/canvas/canvasTypeUtils';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import logger from '@/utils/logger';
import { useCanvasGrid } from './useCanvasGrid';
import { useCanvasZoom } from './useCanvasZoom';
import { useCanvasPan } from './useCanvasPan';
import { useCanvasExport } from './useCanvasExport';
import { useCanvasImport } from './useCanvasImport';
import { useCanvasHistory } from './useCanvasHistory';
import { useCanvasSelection } from './useCanvasSelection';
import { useCanvasFilters } from './useCanvasFilters';
import { useCanvasObjectManipulation } from './useCanvasObjectManipulation';
import { useCanvasDrawing } from './useCanvasDrawing';
import { useCanvasText } from './useCanvasText';
import { useCanvasEraser } from './useCanvasEraser';
import { useCanvasMeasure } from './useCanvasMeasure';
import { useCanvasObjectLocking } from './useCanvasObjectLocking';
import { useCanvasObjectVisibility } from './useCanvasObjectVisibility';
import { useCanvasObjectStyling } from './useCanvasObjectStyling';
import { useCanvasObjectCloning } from './useCanvasObjectCloning';
import { useCanvasObjectAlignment } from './useCanvasObjectAlignment';
import { useCanvasObjectOrdering } from './useCanvasObjectOrdering';
import { useCanvasObjectGrouping } from './useCanvasObjectGrouping';
import { useCanvasObjectDuplication } from './useCanvasObjectDuplication';
import { useCanvasObjectSnapping } from './useCanvasObjectSnapping';
import { useCanvasObjectTransformation } from './useCanvasObjectTransformation';
import { useCanvasInteractionEvents } from './useCanvasInteractionEvents';
import { useCanvasDrawingEvents } from './useCanvasDrawingEvents';
import { useCanvasTouchEvents } from './useCanvasTouchEvents';
import { useCanvasPointerEvents } from './useCanvasPointerEvents';
import { useCanvasDragAndDrop } from './useCanvasDragAndDrop';
import { useCanvasAnimation } from './useCanvasAnimation';
import { useCanvasAccessibility } from './useCanvasAccessibility';
import { useCanvasPerformance } from './useCanvasPerformance';
import { useCanvasUndoRedo } from './useCanvasUndoRedo';
import { useCanvasRealtimeCollaboration } from './useCanvasRealtimeCollaboration';
import { useCanvasAIIntegration } from './useCanvasAIIntegration';
import { useCanvasARVRIntegration } from './useCanvasARVRIntegration';
import { useCanvasDataBinding } from './useCanvasDataBinding';
import { useCanvasTheming } from './useCanvasTheming';
import { useCanvasLocalization } from './useCanvasLocalization';
import { useCanvasTesting } from './useCanvasTesting';
import { useCanvasDebugging } from './useCanvasDebugging';
import { useCanvasSecurity } from './useCanvasSecurity';
import { useCanvasCompliance } from './useCanvasCompliance';
import { useCanvasScalability } from './useCanvasScalability';
import { useCanvasMaintainability } from './useCanvasMaintainability';
import { useCanvasDocumentation } from './useCanvasDocumentation';
import { useCanvasCommunity } from './useCanvasCommunity';
import * as fabric from 'fabric';

interface UseCanvasEventHandlersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  brushColor?: string;
  brushWidth?: number;
  usePressure?: boolean;
  saveCurrentState?: () => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  deleteSelectedObjects?: () => void;
  handleEscape?: () => void;
  handleDelete?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
  onObjectAdded?: (e: any) => void;
  onObjectRemoved?: (e: any) => void;
  onObjectModified?: (e: any) => void;
  processCreatedPath?: (path: any) => void;
  handleMouseDown?: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove?: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp?: (e: MouseEvent | TouchEvent) => void;
  onPathCreated?: (path: any) => void;
  onPathCancelled?: () => void;
  onMouseDown?: (e: any) => void;
  onMouseMove?: (e: any) => void;
  onMouseUp?: (e: any) => void;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  updateZoomLevel?: () => void;
  eventTypes?: string[];
  handlers?: Partial<CanvasEventHandlerMap>;
}

export const useCanvasEventHandlers = ({
  fabricCanvasRef,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2,
  brushColor = '#000000',
  brushWidth = 2,
  usePressure = false,
  saveCurrentState,
  handleUndo,
  handleRedo,
  deleteSelectedObjects,
  handleEscape,
  handleDelete,
  onKeyDown,
  onKeyUp,
  onObjectAdded,
  onObjectRemoved,
  onObjectModified,
  processCreatedPath,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  onPathCreated,
  onPathCancelled,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  initialZoom,
  minZoom,
  maxZoom,
  updateZoomLevel,
  eventTypes,
  handlers
}: UseCanvasEventHandlersProps): void => {
  // Initialize all event handlers
  const keyboardEvents = useKeyboardEvents({
    fabricCanvasRef,
    handleUndo,
    handleRedo,
    deleteSelectedObjects,
    handleEscape,
    handleDelete,
    onKeyDown,
    onKeyUp
  });
  
  const mouseEvents = useMouseEvents({
    fabricCanvasRef,
    tool,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    onMouseDown,
    onMouseMove,
    onMouseUp
  });
  
  const pathEvents = usePathEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    processCreatedPath,
    handleMouseUp,
    onPathCreated,
    onPathCancelled
  });
  
  const objectEvents = useObjectEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    lineColor,
    lineThickness,
    onObjectAdded,
    onObjectRemoved,
    onObjectModified
  });
  
  const brushSettings = useBrushSettings({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    usePressure,
    brushColor,
    brushWidth
  });
  
  const zoomTracking = useZoomTracking({
    fabricCanvasRef,
    initialZoom,
    minZoom,
    maxZoom,
    updateZoomLevel
  });
  
  const canvasHandlers = useCanvasHandlers({
    fabricCanvasRef,
    tool,
    eventTypes,
    handlers
  });
  
  // Register and unregister all event handlers
  useEffect(() => {
    keyboardEvents.register();
    mouseEvents.register();
    pathEvents.register();
    objectEvents.register();
    brushSettings.register();
    zoomTracking.register();
    canvasHandlers.register();
    
    return () => {
      keyboardEvents.unregister();
      mouseEvents.unregister();
      pathEvents.unregister();
      objectEvents.unregister();
      brushSettings.unregister();
      zoomTracking.unregister();
      canvasHandlers.unregister();
    };
  }, [
    keyboardEvents,
    mouseEvents,
    pathEvents,
    objectEvents,
    brushSettings,
    zoomTracking,
    canvasHandlers,
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    usePressure,
    brushColor,
    brushWidth,
    saveCurrentState,
    handleUndo,
    handleRedo,
    deleteSelectedObjects,
    handleEscape,
    handleDelete,
    onKeyDown,
    onKeyUp,
    onObjectAdded,
    onObjectRemoved,
    onObjectModified,
    processCreatedPath,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    onPathCreated,
    onPathCancelled,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    initialZoom,
    minZoom,
    maxZoom,
    updateZoomLevel,
    eventTypes,
    handlers
  ]);

  const handlePathCreation = (path: any) => {
    if (!path) return;
  
    // Process the path regardless of its specific type
    if (processCreatedPath) {
      processCreatedPath(path);
    }
  
    // Trigger the onPathCreated callback
    if (onPathCreated) {
      onPathCreated(path);
    }
  };

  // Drawing mode event handling
  const handleDrawingModeEvents = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleMouseDownEvent = (eventInfo: any) => {
      if (tool !== DrawingMode.DRAW || !canvas.isDrawingMode) return;
      
      // Ensure that eventInfo and eventInfo.e are defined
      if (!eventInfo || !eventInfo.e) {
        logger.warn('Missing event information in mouse down event');
        return;
      }
      
      // Ensure that canvas.freeDrawingBrush is defined
      if (!canvas.freeDrawingBrush) {
        logger.warn('Free drawing brush is not initialized');
        return;
      }
      
      // Convert coordinates to fabric.Point
      const pointer = canvas.getPointer(eventInfo.e);
      const fabricPoint = new fabric.Point(pointer.x, pointer.y);
      
      // Include both 'e' and 'pointer' in brush events
      canvas.freeDrawingBrush.onMouseDown(fabricPoint, {
        e: eventInfo.e,
        pointer: fabricPoint // Required property for TBrushEventData
      });
    };
    
    const handleMouseMoveEvent = (eventInfo: any) => {
      if (tool !== DrawingMode.DRAW || !canvas.isDrawingMode) return;
      
      // Ensure that eventInfo and eventInfo.e are defined
      if (!eventInfo || !eventInfo.e) {
        logger.warn('Missing event information in mouse move event');
        return;
      }
      
      // Ensure that canvas.freeDrawingBrush is defined
      if (!canvas.freeDrawingBrush) {
        logger.warn('Free drawing brush is not initialized');
        return;
      }
      
      // Convert coordinates to fabric.Point
      const pointer = canvas.getPointer(eventInfo.e);
      const fabricPoint = new fabric.Point(pointer.x, pointer.y);
      
      // Include both 'e' and 'pointer' in brush events
      canvas.freeDrawingBrush.onMouseMove(fabricPoint, {
        e: eventInfo.e,
        pointer: fabricPoint // Required property for TBrushEventData
      });
    };
    
    const handleMouseUpEvent = (eventInfo: any) => {
      if (tool !== DrawingMode.DRAW || !canvas.isDrawingMode) return;
      
      // Ensure that eventInfo and eventInfo.e are defined
      if (!eventInfo || !eventInfo.e) {
        logger.warn('Missing event information in mouse up event');
        return;
      }
      
      // Ensure that canvas.freeDrawingBrush is defined
      if (!canvas.freeDrawingBrush) {
        logger.warn('Free drawing brush is not initialized');
        return;
      }
      
      // Convert coordinates to fabric.Point
      const pointer = canvas.getPointer(eventInfo.e);
      const fabricPoint = new fabric.Point(pointer.x, pointer.y);
      
      // Include both 'e' and 'pointer' in brush events
      canvas.freeDrawingBrush.onMouseUp(fabricPoint, {
        e: eventInfo.e,
        pointer: fabricPoint // Required property for TBrushEventData
      });
      
      // Process the path after mouse up
      if (canvas._paths && canvas._paths.length > 0) {
        const lastPath = canvas._paths[canvas._paths.length - 1];
        handlePathCreation(lastPath);
      }
    };
    
    // Attach event listeners
    canvas.on('mouse:down', handleMouseDownEvent);
    canvas.on('mouse:move', handleMouseMoveEvent);
    canvas.on('mouse:up', handleMouseUpEvent);
    
    // Return cleanup function
    return () => {
      canvas.off('mouse:down', handleMouseDownEvent);
      canvas.off('mouse:move', handleMouseMoveEvent);
      canvas.off('mouse:up', handleMouseUpEvent);
    };
  }, [fabricCanvasRef, tool, handlePathCreation]);
  
  // Attach drawing mode events
  useEffect(() => {
    const cleanupDrawingModeEvents = handleDrawingModeEvents();
    
    return () => {
      if (cleanupDrawingModeEvents) {
        cleanupDrawingModeEvents();
      }
    };
  }, [handleDrawingModeEvents]);
};
