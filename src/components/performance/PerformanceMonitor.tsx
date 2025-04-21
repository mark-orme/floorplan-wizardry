
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fps: number;
}

interface PerformanceMonitorProps {
  showToasts?: boolean;
  performanceBudgets?: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
    fps?: number;
  };
  onPerformanceViolation?: (metric: string, value: number, budget: number) => void;
}

/**
 * Performance Monitor Component
 * Tracks core web vitals and performance metrics
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showToasts = process.env.NODE_ENV === 'development',
  performanceBudgets = {
    fcp: 2000, // 2 seconds
    lcp: 2500, // 2.5 seconds
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    ttfb: 800, // 800ms
    fps: 30    // 30fps
  },
  onPerformanceViolation
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fps: 0
  });
  
  // Track FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    const countFrames = () => {
      frameCount++;
      frameId = requestAnimationFrame(countFrames);
    };
    
    // Start counting frames
    frameId = requestAnimationFrame(countFrames);
    
    // Update FPS every second
    const intervalId = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastTime;
      const fps = Math.round((frameCount * 1000) / elapsed);
      
      setMetrics(prev => ({ ...prev, fps }));
      
      // Check FPS budget
      if (performanceBudgets.fps && fps < performanceBudgets.fps) {
        if (onPerformanceViolation) {
          onPerformanceViolation('fps', fps, performanceBudgets.fps);
        }
        
        if (showToasts) {
          toast.warning(`Low FPS: ${fps}`, {
            id: 'low-fps',
            description: `Target: ${performanceBudgets.fps} FPS`
          });
        }
      }
      
      // Reset counters
      frameCount = 0;
      lastTime = now;
    }, 1000);
    
    // Track web vitals if available
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0].startTime;
          setMetrics(prev => ({ ...prev, fcp }));
          
          // Check FCP budget
          if (performanceBudgets.fcp && fcp > performanceBudgets.fcp) {
            if (onPerformanceViolation) {
              onPerformanceViolation('fcp', fcp, performanceBudgets.fcp);
            }
            
            if (showToasts) {
              toast.warning(`Slow FCP: ${Math.round(fcp)}ms`, {
                id: 'slow-fcp',
                description: `Target: ${performanceBudgets.fcp}ms`
              });
            }
          }
        }
      });
      
      // Try to observe FCP
      try {
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {
        console.error('Failed to observe FCP:', e);
      }
      
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        setMetrics(prev => ({ ...prev, lcp }));
        
        // Check LCP budget
        if (performanceBudgets.lcp && lcp > performanceBudgets.lcp) {
          if (onPerformanceViolation) {
            onPerformanceViolation('lcp', lcp, performanceBudgets.lcp);
          }
          
          if (showToasts) {
            toast.warning(`Slow LCP: ${Math.round(lcp)}ms`, {
              id: 'slow-lcp',
              description: `Target: ${performanceBudgets.lcp}ms`
            });
          }
        }
      });
      
      // Try to observe LCP
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.error('Failed to observe LCP:', e);
      }
      
      // TTFB (Time to First Byte)
      const navigationObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const entry = entries[0] as PerformanceNavigationTiming;
          const ttfb = entry.responseStart;
          
          setMetrics(prev => ({ ...prev, ttfb }));
          
          // Check TTFB budget
          if (performanceBudgets.ttfb && ttfb > performanceBudgets.ttfb) {
            if (onPerformanceViolation) {
              onPerformanceViolation('ttfb', ttfb, performanceBudgets.ttfb);
            }
            
            if (showToasts) {
              toast.warning(`Slow TTFB: ${Math.round(ttfb)}ms`, {
                id: 'slow-ttfb',
                description: `Target: ${performanceBudgets.ttfb}ms`
              });
            }
          }
        }
      });
      
      // Try to observe navigation timing
      try {
        navigationObserver.observe({ type: 'navigation', buffered: true });
      } catch (e) {
        console.error('Failed to observe navigation timing:', e);
      }
      
      // Clean up observers
      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        navigationObserver.disconnect();
        clearInterval(intervalId);
        cancelAnimationFrame(frameId);
      };
    }
    
    // Clean up if no PerformanceObserver
    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(frameId);
    };
  }, [showToasts, performanceBudgets, onPerformanceViolation]);
  
  // This component doesn't render anything visible
  return null;
};

export default PerformanceMonitor;
