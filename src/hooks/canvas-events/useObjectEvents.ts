
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/constants/drawingModes";
import { EventHandlerResult, UseObjectEventsProps } from "./types";

/**
 * Hook for handling Fabric.js object events
 * Manages object selection, modification, and related operations
 * 
 * @param {UseObjectEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} Functions to register and cleanup event handlers
 */
export const useObjectEvents = (props: UseObjectEventsProps): EventHandlerResult => {
  const { fabricCanvasRef, tool, saveCurrentState } = props;

  /**
   * Handle object modified event
   * Triggered when an object on the canvas is modified
   * 
   * @param {any} e - The event object
   */
  const handleObjectModified = useCallback((e: any) => {
    saveCurrentState();
  }, [saveCurrentState]);

  /**
   * Handle object selection event
   * Triggered when an object on the canvas is selected
   * 
   * @param {any} e - The event object
   */
  const handleObjectSelected = useCallback((e: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Do any selection-specific handling here
    console.log("Object selected:", e.target);
  }, [fabricCanvasRef]);
  
  /**
   * Register all object event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Register object events with proper types
    canvas.on('object:modified', handleObjectModified);
    // Use 'as any' to bypass type checking for this specific event
    // that's part of Fabric.js but not included in the type definitions
    (canvas as any).on('object:selected', handleObjectSelected);
    
    console.log("Registered object event handlers");
  }, [fabricCanvasRef, handleObjectModified, handleObjectSelected]);
  
  /**
   * Unregister all object event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.off('object:modified', handleObjectModified);
    // Use 'as any' to bypass type checking for this specific event
    (canvas as any).off('object:selected', handleObjectSelected);
    
    console.log("Unregistered object event handlers");
  }, [fabricCanvasRef, handleObjectModified, handleObjectSelected]);
  
  /**
   * Clean up object event handlers
   */
  const cleanup = useCallback(() => {
    unregister();
    console.log("Cleaned up object event handlers");
  }, [unregister]);
  
  // Register event handlers on mount
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);
  
  return {
    register,
    unregister,
    cleanup
  };
};
