
/**
 * Touch gesture handler component for fabric canvas
 * Optimizes touch and Apple Pencil interactions
 */
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useApplePencilSupport } from '@/hooks/straightLineTool/useApplePencilSupport';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';

interface TouchGestureHandlerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness?: number;
}

// Define custom Touch interface with timestamp
interface EnhancedTouch extends Touch {
  timestamp?: number;
}

export const TouchGestureHandler: React.FC<TouchGestureHandlerProps> = ({ 
  fabricCanvasRef, 
  lineThickness = 2 
}) => {
  const lastTouchRef = useRef<EnhancedTouch | null>(null);
  const { reportDrawingError } = useDrawingErrorReporting();
  
  // Use Apple Pencil support hook
  const { 
    isPencilMode, 
    isApplePencil,
    processPencilTouchEvent 
  } = useApplePencilSupport({
    fabricCanvasRef,
    lineThickness
  });
  
  // Set up touch gesture handling
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const canvasElement = canvas.getElement();
    
    // Handle gesture events to prevent unwanted behaviors
    const preventPinchZoom = (e: TouchEvent) => {
      // Only prevent if we're in drawing mode to allow pinch-zoom in view mode
      if (canvas.isDrawingMode || isPencilMode) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }
    };
    
    // Handle palm rejection for Apple Pencil
    const handleTouchStart = (e: TouchEvent) => {
      try {
        // Process the event to detect Apple Pencil
        const pencilData = processPencilTouchEvent(e);
        
        // If in pencil mode, implement palm rejection
        if (isPencilMode && !pencilData.isApplePencil) {
          // If we have a recent pencil touch, reject finger touches to prevent palm interference
          const enhancedTouch = lastTouchRef.current as EnhancedTouch | null;
          if (enhancedTouch && enhancedTouch.timestamp && Date.now() - enhancedTouch.timestamp < 1000) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
        
        // Store pencil touches for palm rejection
        if (pencilData.isApplePencil) {
          const touch = e.touches[0] as EnhancedTouch;
          // Store touch with timestamp
          touch.timestamp = Date.now();
          lastTouchRef.current = touch;
        }
      } catch (error) {
        reportDrawingError(error, 'touch-gesture-handler', {
          interaction: { type: 'touch' }
        });
      }
    };
    
    // Disable iOS-specific gestures when in drawing mode
    const preventIOSGestures = () => {
      // Check if running on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // Add meta viewport to disable scaling if not already present
        let viewport = document.querySelector('meta[name="viewport"]');
        const viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        if (!viewport) {
          viewport = document.createElement('meta');
          viewport.setAttribute('name', 'viewport');
          document.head.appendChild(viewport);
        }
        
        // Store original content to restore later
        const originalContent = viewport.getAttribute('content') || '';
        viewport.setAttribute('content', viewportContent);
        
        // Disable elastic scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.height = '100%';
        document.body.style.width = '100%';
        
        return () => {
          // Restore original settings
          viewport?.setAttribute('content', originalContent);
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.height = '';
          document.body.style.width = '';
        };
      }
      
      return () => {}; // No-op for non-iOS
    };
    
    // Set up event listeners for touch handling
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchmove', preventPinchZoom, { passive: false });
    canvasElement.addEventListener('gesturestart', preventPinchZoom, { passive: false });
    canvasElement.addEventListener('gesturechange', preventPinchZoom, { passive: false });
    
    // Handle iOS-specific settings
    const cleanupIOSSettings = preventIOSGestures();
    
    return () => {
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchmove', preventPinchZoom);
      canvasElement.removeEventListener('gesturestart', preventPinchZoom);
      canvasElement.removeEventListener('gesturechange', preventPinchZoom);
      
      // Clean up iOS-specific settings
      cleanupIOSSettings();
    };
  }, [fabricCanvasRef, isPencilMode, processPencilTouchEvent, reportDrawingError]);
  
  // This is a non-visual component that just manages event handlers
  return null;
};
