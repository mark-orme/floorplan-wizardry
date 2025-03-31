
/**
 * Diagnostic utilities for straight line tool
 * @module utils/diagnostics/lineToolDiagnostics
 */
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage, captureError } from '@/utils/sentry';
import logger from '@/utils/logger';
import { toast } from 'sonner';

/**
 * Comprehensive diagnostic information for the straight line tool
 */
interface LineToolDiagnostics {
  canvasInfo: {
    isAvailable: boolean;
    dimensions?: { width: number; height: number };
    objectCount?: number;
    isDrawingMode?: boolean;
    selection?: boolean;
    defaultCursor?: string;
    renderedObjects?: Array<{ type: string; id?: string }>;
  };
  eventHandlers: {
    mouseDown: boolean;
    mouseMove: boolean;
    mouseUp: boolean;
    hasCustomHandlers: boolean;
  };
  toolState: {
    activeTool: string;
    isToolInitialized: boolean;
    isDrawing: boolean;
  };
  browserInfo: {
    userAgent: string;
    platform: string;
    touchEnabled: boolean;
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    timestamp: string;
  };
}

/**
 * Run full diagnostics on the straight line tool
 * 
 * @param {FabricCanvas | null} canvas - The Fabric canvas instance
 * @param {DrawingMode} currentTool - Current drawing tool
 * @param {boolean} isToolInitialized - Whether the tool is initialized
 * @param {boolean} isDrawing - Whether drawing is in progress
 * @returns {LineToolDiagnostics} Comprehensive diagnostic information
 */
export const runLineToolDiagnostics = (
  canvas: FabricCanvas | null,
  currentTool: DrawingMode,
  isToolInitialized: boolean,
  isDrawing: boolean
): LineToolDiagnostics => {
  // Start with basic browser and environment information
  const diagnostics: LineToolDiagnostics = {
    canvasInfo: {
      isAvailable: !!canvas
    },
    eventHandlers: {
      mouseDown: false,
      mouseMove: false,
      mouseUp: false,
      hasCustomHandlers: false
    },
    toolState: {
      activeTool: currentTool,
      isToolInitialized,
      isDrawing
    },
    browserInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      touchEnabled: 'ontouchstart' in window,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      timestamp: new Date().toISOString()
    }
  };
  
  // Only proceed with canvas diagnostics if canvas is available
  if (canvas) {
    try {
      // Canvas basic information
      diagnostics.canvasInfo.dimensions = {
        width: canvas.width || 0,
        height: canvas.height || 0
      };
      
      diagnostics.canvasInfo.objectCount = canvas.getObjects().length;
      diagnostics.canvasInfo.isDrawingMode = canvas.isDrawingMode;
      diagnostics.canvasInfo.selection = canvas.selection;
      diagnostics.canvasInfo.defaultCursor = canvas.defaultCursor;
      
      // Get rendered object types
      diagnostics.canvasInfo.renderedObjects = canvas.getObjects().map(obj => ({
        type: obj.type || 'unknown',
        id: (obj as any).id || undefined
      }));
      
      // Check event handlers
      // We need to access private properties to check event handlers
      // This is not ideal but necessary for diagnostics
      // Use type assertion to access private property for diagnostics
      const eventListeners = (canvas as any).__eventListeners || {};
      
      diagnostics.eventHandlers.mouseDown = 
        Array.isArray(eventListeners['mouse:down']) && 
        eventListeners['mouse:down'].length > 0;
        
      diagnostics.eventHandlers.mouseMove = 
        Array.isArray(eventListeners['mouse:move']) && 
        eventListeners['mouse:move'].length > 0;
        
      diagnostics.eventHandlers.mouseUp = 
        Array.isArray(eventListeners['mouse:up']) && 
        eventListeners['mouse:up'].length > 0;
      
      // Check if our custom handlers are attached (approximate check)
      diagnostics.eventHandlers.hasCustomHandlers = 
        diagnostics.eventHandlers.mouseDown && 
        diagnostics.eventHandlers.mouseMove && 
        diagnostics.eventHandlers.mouseUp;
      
    } catch (error) {
      // If diagnostics fail, capture that error
      captureError(error as Error, "line-tool-diagnostics-error", {
        tags: { component: "lineToolDiagnostics" }
      });
      
      logger.error("Error gathering line tool diagnostics", error);
    }
  }
  
  return diagnostics;
};

/**
 * Run diagnostics and send to Sentry
 * 
 * @param {FabricCanvas | null} canvas - The Fabric canvas instance
 * @param {DrawingMode} currentTool - Current drawing tool
 * @param {boolean} isToolInitialized - Whether the tool is initialized
 * @param {boolean} isDrawing - Whether drawing is in progress
 * @param {boolean} userInitiated - Whether the diagnostics were user-initiated
 * @returns {LineToolDiagnostics} The diagnostic results
 */
export const reportLineToolDiagnostics = (
  canvas: FabricCanvas | null,
  currentTool: DrawingMode,
  isToolInitialized: boolean,
  isDrawing: boolean,
  userInitiated: boolean = false
): LineToolDiagnostics => {
  try {
    const diagnostics = runLineToolDiagnostics(
      canvas, 
      currentTool, 
      isToolInitialized, 
      isDrawing
    );
    
    // Create a more user-friendly status summary
    const toolStatus = diagnostics.canvasInfo.isAvailable ? 
      (diagnostics.eventHandlers.hasCustomHandlers ? 
        "Properly configured" : 
        "Missing event handlers") : 
      "Canvas unavailable";
    
    // If user initiated, show toast with status
    if (userInitiated) {
      toast.info(`Line tool diagnostics: ${toolStatus}`);
    }
    
    // Send to Sentry
    captureMessage(
      userInitiated ? 
        "User initiated line tool diagnostics" : 
        "Automatic line tool diagnostics", 
      "line-tool-diagnostics",
      {
        tags: { 
          component: "lineToolDiagnostics",
          userInitiated: userInitiated ? "true" : "false",
          toolStatus,
          toolIsActive: currentTool === DrawingMode.STRAIGHT_LINE ? "true" : "false"
        },
        extra: diagnostics
      }
    );
    
    logger.info("Line tool diagnostics report", { 
      diagnosticsSummary: toolStatus,
      userInitiated 
    });
    
    return diagnostics;
  } catch (error) {
    captureError(error as Error, "line-tool-diagnostics-reporting-error");
    logger.error("Failed to report line tool diagnostics", error);
    
    if (userInitiated) {
      toast.error("Failed to run diagnostics");
    }
    
    // Return minimal diagnostics with error info
    return {
      canvasInfo: { isAvailable: false },
      eventHandlers: { mouseDown: false, mouseMove: false, mouseUp: false, hasCustomHandlers: false },
      toolState: { activeTool: currentTool, isToolInitialized, isDrawing },
      browserInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        touchEnabled: 'ontouchstart' in window,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        timestamp: new Date().toISOString()
      }
    };
  }
};

/**
 * Attempt to repair common issues with the straight line tool
 * 
 * @param {FabricCanvas | null} canvas - The Fabric canvas instance
 * @returns {boolean} Whether repair was successful
 */
export const attemptLineToolRepair = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.error("Cannot repair line tool: canvas is null");
    return false;
  }
  
  try {
    logger.info("Attempting to repair line tool");
    
    // Reset canvas configuration to known-good state
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    
    // Force canvas to re-render
    canvas.requestRenderAll();
    
    // Force a canvas redraw
    canvas.setViewportTransform(canvas.viewportTransform);
    
    // Signal canvas needs full redraw
    canvas.renderAll(true);
    
    // Report repair attempt
    captureMessage("Line tool repair attempted", "line-tool-repair", {
      tags: { component: "lineToolDiagnostics" },
      extra: {
        canvasProperties: {
          width: canvas.width,
          height: canvas.height,
          isDrawingMode: canvas.isDrawingMode,
          selection: canvas.selection,
          defaultCursor: canvas.defaultCursor
        }
      }
    });
    
    toast.success("Drawing tool repair attempted");
    return true;
  } catch (error) {
    captureError(error as Error, "line-tool-repair-error");
    logger.error("Failed to repair line tool", error);
    return false;
  }
};
