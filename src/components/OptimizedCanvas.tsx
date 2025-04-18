
import React, { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { optimizeForStylus, preventTouchBehaviors } from "@/utils/canvas/canvasHelpers";
import { applyIOSEventFixes } from "@/utils/fabric/events";
import { useIsMobile } from "@/hooks/use-mobile";

interface OptimizedCanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2,
  showGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const isMobile = useIsMobile();
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Initializing canvas...");
      
      // Create canvas with mobile-friendly options
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: tool === DrawingMode.SELECT,
        backgroundColor: "#ffffff",
        // Mobile-specific settings
        enableRetinaScaling: true,
        renderOnAddRemove: false, // Improve performance on mobile
        fireRightClick: true, // Enable right-click on mobile
        stopContextMenu: true, // Prevent context menu on mobile
      });
      
      fabricCanvasRef.current = canvas;
      
      // Set initial brush properties
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
      
      // Apply mobile-specific optimizations
      if (isMobile) {
        // Optimize for stylus and touch input
        optimizeForStylus(canvas);
        
        // Apply iOS-specific fixes
        applyIOSEventFixes(canvasRef.current);
        
        // Prevent default touch behaviors during drawing
        const cleanup = preventTouchBehaviors(canvasRef.current);
        
        // Add touch-specific class
        canvasRef.current.classList.add("mobile-optimized-canvas");
        
        console.log("Mobile optimizations applied to canvas");
      }
      
      // Notify that canvas is ready
      onCanvasReady(canvas);
      console.log("Canvas initialized successfully!");
      
    } catch (error) {
      console.error("Error initializing canvas:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
    
    // Cleanup
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, lineColor, lineThickness, onCanvasReady, onError, tool, isMobile]);
  
  // Update drawing tools when they change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Update drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    // Update brush properties if in drawing mode
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    // Update cursor style based on tool
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.defaultCursor = "crosshair";
        break;
      case DrawingMode.SELECT:
        canvas.defaultCursor = "default";
        break;
      case DrawingMode.HAND:
        canvas.defaultCursor = "grab";
        break;
      default:
        canvas.defaultCursor = "default";
    }
    
    canvas.renderAll();
  }, [tool, lineColor, lineThickness]);
  
  return (
    <canvas
      ref={canvasRef}
      className="touch-manipulation"
      data-testid="optimized-canvas"
      style={{
        touchAction: "none", // Critical for preventing browser gestures
        WebkitTapHighlightColor: "transparent", // Remove tap highlight on iOS
        WebkitTouchCallout: "none", // Disable callout on long press
        WebkitUserSelect: "none", // Disable text selection on iOS
        width: "100%",
        height: "100%"
      }}
    />
  );
};

export default OptimizedCanvas;
