
/**
 * Hook for Apple Pencil and stylus support in drawing tools
 * @module hooks/straightLineTool/useApplePencilSupport
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * @interface PencilState
 * @description Tracks the current state of a stylus input
 * @property {number} pressure - Pressure applied (0-1)
 * @property {number} tiltX - Tilt on X axis (in degrees)
 * @property {number} tiltY - Tilt on Y axis (in degrees)
 * @property {number} twist - Stylus rotation (in degrees, if available)
 */
interface PencilState {
  pressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
}

/**
 * @interface UseApplePencilSupportProps
 * @description Configuration for the Apple Pencil support hook
 * @property {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to the Fabric canvas
 * @property {number} lineThickness - Base thickness of lines to be drawn
 */
interface UseApplePencilSupportProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness: number;
}

/**
 * Hook for handling Apple Pencil and other stylus input with improved precision
 * 
 * @param {UseApplePencilSupportProps} props - Configuration props
 * @returns {Object} Pencil support state and methods
 */
export const useApplePencilSupport = ({
  fabricCanvasRef,
  lineThickness
}: UseApplePencilSupportProps) => {
  // Track stylus state
  const [pencilState, setPencilState] = useState<PencilState>({
    pressure: 1,
    tiltX: 0,
    tiltY: 0,
    twist: 0
  });
  
  // Track if Apple Pencil is being used
  const [isApplePencil, setIsApplePencil] = useState(false);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Calculate adjusted line thickness based on pressure
  const adjustedLineThickness = Math.max(
    pencilState.pressure * lineThickness,
    lineThickness * 0.5 // Ensure minimum visibility
  );
  
  /**
   * Handle pointer pressure events with improved precision
   * @param {PointerEvent} e - Pointer event containing stylus data
   */
  const handlePointerEvent = useCallback((e: PointerEvent) => {
    // Check if it's a pen/stylus
    if (e.pointerType === 'pen') {
      setIsApplePencil(true);
      
      // Use precise pressure values or default to 1
      const pressure = e.pressure || 1;
      
      // Prevent extremely thin lines by setting minimum pressure
      const normalizedPressure = Math.max(pressure, 0.5);
      
      setPencilState({
        pressure: normalizedPressure,
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0,
        twist: (e as any).twist || 0  // Not supported in all browsers
      });
      setIsPencilMode(true);
      
      // Prevent default browser handling that may interfere
      if (e.type === 'pointermove') {
        e.preventDefault();
      }
    } else {
      setIsApplePencil(false);
      setIsPencilMode(false);
    }
  }, []);
  
  /**
   * Process a touch event to extract Apple Pencil data
   * Enhanced detection for iOS devices
   * 
   * @param {TouchEvent} e - Touch event to process
   * @returns {Object} Object containing pencil data and detection status
   */
  const processPencilTouchEvent = useCallback((e: TouchEvent): { 
    isApplePencil: boolean;
    pressure: number;
    touchType: string;
  } => {
    // Default values
    let isApplePencil = false;
    let pressure = 1;
    let touchType = 'touch';
    
    try {
      // Check if this is potentially an Apple Pencil touch
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0] as any;
        
        // Apple Pencil provides force data on iOS
        if (typeof touch.force !== 'undefined') {
          // Get force with fallback to 1
          pressure = Math.max(touch.force || 1, 0.5);
          
          // Force values > 0 typically indicate stylus
          if (pressure > 0) {
            isApplePencil = true;
            touchType = 'stylus';
            
            // Update pencil state
            setPencilState(prev => ({
              ...prev,
              pressure,
              // Other properties might not be available via touch API
            }));
            
            setIsApplePencil(true);
            setIsPencilMode(true);
          }
        }
        
        // Some browsers provide touchType property
        if (touch.touchType && touch.touchType === 'stylus') {
          isApplePencil = true;
          touchType = 'stylus';
          setIsApplePencil(true);
          setIsPencilMode(true);
        }
        
        // Radius is often smaller for stylus vs finger
        if (touch.radiusX && touch.radiusY) {
          const isSmallRadius = touch.radiusX < 10 && touch.radiusY < 10;
          if (isSmallRadius) {
            // Additional evidence of stylus
            isApplePencil = isApplePencil || isSmallRadius;
            
            // If we detect a stylus by radius and no pressure data,
            // set a default pressure that feels good
            if (pressure === 1 && typeof touch.force === 'undefined') {
              pressure = 0.8; // Good default for precision drawing
              setPencilState(prev => ({
                ...prev,
                pressure
              }));
            }
          }
        }
        
        // Check for precise touches (another stylus indicator)
        if (touch.clientX && typeof touch.clientX === 'number' && 
            touch.clientX % 1 !== 0 && !isApplePencil) {
          // Sub-pixel precision often indicates a stylus
          isApplePencil = true;
          touchType = 'precise-touch';
          setIsApplePencil(true);
          setIsPencilMode(true);
        }
      }
    } catch (error) {
      console.error('Error detecting Apple Pencil:', error);
    }
    
    return { isApplePencil, pressure, touchType };
  }, []);
  
  /**
   * Snap drawing point to grid when using Apple Pencil
   * Provides enhanced precision for stylus input
   * 
   * @param {Point} point - Point to snap to grid
   * @returns {Point} Snapped point
   */
  const snapPencilPointToGrid = useCallback((point: { x: number, y: number }) => {
    if (!isApplePencil) return point;
    
    // Use Grid constants for grid size
    const gridSize = GRID_CONSTANTS.GRID_SIZE;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [isApplePencil]);
  
  // Set up event listeners when the canvas is available
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const handlePointerDown = handlePointerEvent;
    const handlePointerMove = handlePointerEvent;
    
    // Get the canvas element
    const canvasElement = fabricCanvasRef.current.getElement();
    
    if (canvasElement) {
      // Use passive: false for pointer events to allow preventDefault
      canvasElement.addEventListener('pointerdown', handlePointerDown, { passive: false });
      canvasElement.addEventListener('pointermove', handlePointerMove, { passive: false });
      
      // Additional event to improve Apple Pencil detection on iOS
      canvasElement.addEventListener('touchstart', (e: TouchEvent) => {
        processPencilTouchEvent(e);
        
        // Prevent default for stylus touches to avoid iOS gesture conflicts
        if (e.touches && e.touches.length === 1) {
          const touchData = processPencilTouchEvent(e);
          if (touchData.isApplePencil) {
            e.preventDefault();
          }
        }
      }, { passive: false });
      
      // Apply iOS-specific fixes
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Prevent iOS gestures from interfering with drawing
        document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
      }
      
      return () => {
        canvasElement.removeEventListener('pointerdown', handlePointerDown);
        canvasElement.removeEventListener('pointermove', handlePointerMove);
        canvasElement.removeEventListener('touchstart', processPencilTouchEvent as any);
        
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.removeEventListener('gesturestart', (e) => e.preventDefault());
          document.removeEventListener('gesturechange', (e) => e.preventDefault());
        }
      };
    }
  }, [fabricCanvasRef, handlePointerEvent, processPencilTouchEvent]);
  
  return {
    pencilState,
    isPencilMode,
    isApplePencil,
    adjustedLineThickness,
    processPencilTouchEvent,
    snapPencilPointToGrid
  };
};
