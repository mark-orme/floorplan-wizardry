import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createGroup, createPath, isGroup, isPath } from '@/components/canvas/fabric/FabricComponents';
import { createFabricPath } from '@/utils/fabric/fabric-path-adapter';
import { addCanvasEvent, removeCanvasEvent } from '@/utils/canvas/eventHandlers';

interface UseCanvasInteractionsProps {
  canvas: FabricCanvas | null;
  onObjectSelected?: (obj: any) => void;
  onSelectionCleared?: () => void;
}

export const useCanvasInteractions = ({ canvas, onObjectSelected, onSelectionCleared }: UseCanvasInteractionsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);
  const [panningEnabled, setPanningEnabled] = useState(false);
  const initialPanRef = useRef({ x: 0, y: 0 });
  
  const handleObjectSelected = useCallback((event: any) => {
    if (onObjectSelected) {
      onObjectSelected(event.target);
    }
  }, [onObjectSelected]);
  
  const handleSelectionCleared = useCallback(() => {
    if (onSelectionCleared) {
      onSelectionCleared();
    }
  }, [onSelectionCleared]);
  
  const handleMouseDown = useCallback((event: any) => {
    if (!canvas) return;
    
    setIsDragging(true);
    setLastPosition({ x: event.e.clientX, y: event.e.clientY });
    initialPanRef.current = { x: canvas.viewportTransform[4], y: canvas.viewportTransform[5] };
  }, [canvas]);
  
  const handleMouseMove = useCallback((event: any) => {
    if (!canvas) return;
    
    if (panningEnabled && isDragging) {
      const deltaX = event.e.clientX - (lastPosition?.x || 0);
      const deltaY = event.e.clientY - (lastPosition?.y || 0);
      
      canvas.viewportTransform[4] = initialPanRef.current.x + deltaX;
      canvas.viewportTransform[5] = initialPanRef.current.y + deltaY;
      
      canvas.requestRenderAll();
    }
    
    setLastPosition({ x: event.e.clientX, y: event.e.clientY });
  }, [canvas, isDragging, lastPosition, panningEnabled]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleMouseWheel = useCallback((event: any) => {
    if (!canvas) return;
    
    const delta = event.e.deltaY;
    const zoom = canvas.getZoom();
    const newZoom = zoom + delta / 2000;
    
    canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, newZoom);
    event.e.preventDefault();
    event.e.stopPropagation();
  }, [canvas]);
  
  const togglePanning = useCallback(() => {
    setPanningEnabled(prev => !prev);
  }, []);
  
  const addPath = useCallback((pathData: string) => {
    if (!canvas) return;
    
    const path = createFabricPath(pathData);
    if (path) {
      canvas.add(path);
    }
  }, [canvas]);
  
  const groupSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    if (canvas.getActiveObject()) {
      if (canvas.getActiveObject().type === 'activeSelection') {
        // @ts-ignore
        canvas.getActiveObject().toGroup();
        canvas.requestRenderAll();
      }
    }
  }, [canvas]);
  
  const ungroupSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    if (canvas.getActiveObject()) {
      if (canvas.getActiveObject().type === 'group') {
        // @ts-ignore
        canvas.getActiveObject().ungroup();
        canvas.requestRenderAll();
      }
    }
  }, [canvas]);
  
  useEffect(() => {
    if (!canvas) return;
    
    addCanvasEvent(canvas, 'object:selected', handleObjectSelected);
    addCanvasEvent(canvas, 'selection:cleared', handleSelectionCleared);
    addCanvasEvent(canvas, 'mouse:down', handleMouseDown);
    addCanvasEvent(canvas, 'mouse:move', handleMouseMove);
    addCanvasEvent(canvas, 'mouse:up', handleMouseUp);
    addCanvasEvent(canvas, 'mouse:wheel', handleMouseWheel);
    
    return () => {
      removeCanvasEvent(canvas, 'object:selected', handleObjectSelected);
      removeCanvasEvent(canvas, 'selection:cleared', handleSelectionCleared);
      removeCanvasEvent(canvas, 'mouse:down', handleMouseDown);
      removeCanvasEvent(canvas, 'mouse:move', handleMouseMove);
      removeCanvasEvent(canvas, 'mouse:up', handleMouseUp);
      removeCanvasEvent(canvas, 'mouse:wheel', handleMouseWheel);
    };
  }, [canvas, handleObjectSelected, handleSelectionCleared, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseWheel]);
  
  return {
    panningEnabled,
    togglePanning,
    addPath,
    groupSelectedObjects,
    ungroupSelectedObjects
  };
};
