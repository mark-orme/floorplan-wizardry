
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugInfoState } from '@/types/fabric-unified';

interface UseCanvasDebugProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
  refreshInterval?: number;
}

// Help function to calculate FPS
const calculateFPS = (frames: number, elapsedTime: number) => {
  return Math.min(Math.round((frames * 1000) / elapsedTime), 120); // Cap at 120 FPS
};

export const useCanvasDebug = ({
  fabricCanvasRef,
  enabled = false,
  refreshInterval = 1000
}: UseCanvasDebugProps) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    objectCount: 0,
    visibleObjects: 0,
    fps: 0,
    renderTime: 0,
    gridStatus: 'disabled',
    version: '1.0.0'
  });
  
  const [isVisible, setIsVisible] = useState(enabled);
  
  // Toggle debug display visibility
  const toggleDebugDisplay = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);
  
  // Function to update debug info
  const updateDebugInfo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get all objects and count visible ones
    const objects = canvas.getObjects ? canvas.getObjects() : [];
    const visibleObjects = objects.filter(obj => obj.visible !== false);
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      objectCount: objects.length,
      visibleObjects: visibleObjects.length
    }));
  }, [fabricCanvasRef]);
  
  // Set up FPS counter
  useEffect(() => {
    if (!isVisible || !fabricCanvasRef.current) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    const measureFPS = () => {
      frameCount++;
      
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= refreshInterval) {
        const fps = calculateFPS(frameCount, elapsed);
        
        setDebugInfo(prev => ({
          ...prev,
          fps,
          renderTime: elapsed / frameCount
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameId = requestAnimationFrame(measureFPS);
    };
    
    frameId = requestAnimationFrame(measureFPS);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isVisible, fabricCanvasRef, refreshInterval]);
  
  // Set up canvas event listeners for debug info
  useEffect(() => {
    if (!isVisible || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Update debug info on various canvas events
    const events = [
      'object:added',
      'object:removed',
      'object:modified',
      'object:visibility:changed'
    ];
    
    events.forEach(event => {
      canvas.on(event, updateDebugInfo);
    });
    
    // Initial update
    updateDebugInfo();
    
    return () => {
      events.forEach(event => {
        canvas.off(event, updateDebugInfo);
      });
    };
  }, [isVisible, fabricCanvasRef, updateDebugInfo]);
  
  return {
    debugInfo,
    isVisible,
    toggleDebugDisplay,
    updateDebugInfo
  };
};
