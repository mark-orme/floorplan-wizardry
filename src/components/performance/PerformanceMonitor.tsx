import React, { useRef, useEffect } from 'react';

export const PerformanceMonitor = () => {
  const frameRateRef = useRef<HTMLDivElement>(null);
  const frameTimeRef = useRef<HTMLDivElement>(null);
  const toolUsageRef = useRef<HTMLDivElement>(null);
  const averageFrameTimeRef = useRef<HTMLDivElement>(null);
  
  const metrics = useRef({
    fps: 0,
    frameTime: 0,
    toolUsageDuration: {
      select: 0,
      draw: 0
    }
  }).current;
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;
    
    const updateFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      frameCount++;
      
      if (delta >= 1000) {
        const fps = frameCount;
        metrics.fps = fps;
        metrics.frameTime = delta / frameCount;
        
        if (frameRateRef.current) {
          frameRateRef.current.textContent = `${fps} FPS`;
        }
        
        frameCount = 0;
        lastTime = now;
      }
      
      animationFrameId = requestAnimationFrame(updateFPS);
    };
    
    const calculateAverageFrameTime = () => {
      const entries = performance.getEntriesByType("frame");
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry) return 0; // Return default value if undefined
      
      return lastEntry.value || 0; // Return 0 if value is undefined
    };
    
    const updateAverageFrameTime = () => {
      const avgFrameTime = calculateAverageFrameTime();
      
      if (averageFrameTimeRef.current) {
        averageFrameTimeRef.current.textContent = `${avgFrameTime.toFixed(2)} ms`;
      }
    };
    
    animationFrameId = requestAnimationFrame(updateFPS);
    
    const intervalId = setInterval(updateAverageFrameTime, 500);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, []);
  
  useEffect(() => {
    const updateToolUsage = () => {
      if (toolUsageRef.current) {
        toolUsageRef.current.textContent = `Select: ${metrics.toolUsageDuration.select}ms, Draw: ${metrics.toolUsageDuration.draw}ms`;
      }
    };
    
    updateToolUsage();
  }, []);
  
  return (
    <div className="fixed bottom-4 left-4 bg-white p-2 rounded shadow-md text-sm">
      <div ref={frameRateRef}>FPS: 0</div>
      <div ref={frameTimeRef}>Frame Time: 0ms</div>
      <div ref={averageFrameTimeRef}>Avg Frame Time: 0ms</div>
      <div ref={toolUsageRef}>Tool Usage:</div>
    </div>
  );
};
