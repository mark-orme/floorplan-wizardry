
/**
 * React Profiler Component for Performance Monitoring
 * 
 * This component wraps child components with React's Profiler API to
 * measure rendering performance and identify unnecessary re-renders.
 */
import React, { Profiler, ProfilerOnRenderCallback, useCallback, useState } from 'react';

interface RenderMetric {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  timestamp: number;
}

interface ReactProfilerProps {
  id: string;
  children: React.ReactNode;
  onlySlowRenders?: boolean;
  slowRenderThreshold?: number; // in ms
  enabled?: boolean;
}

export const ReactProfiler: React.FC<ReactProfilerProps> = ({
  id,
  children,
  onlySlowRenders = true,
  slowRenderThreshold = 5, // 5ms is considered slow
  enabled = process.env.NODE_ENV === 'development'
}) => {
  const [metrics, setMetrics] = useState<RenderMetric[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const handleRender: ProfilerOnRenderCallback = useCallback(
    (profilerId, phase, actualDuration, baseDuration, startTime, commitTime) => {
      // Skip if disabled
      if (!enabled) return;
      
      // Only log slow renders if requested
      if (onlySlowRenders && actualDuration < slowRenderThreshold) return;
      
      // Create metric object
      const metric: RenderMetric = {
        id: profilerId,
        phase: phase === 'mount' ? 'mount' : 'update',
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        timestamp: Date.now()
      };
      
      // Log to console
      console.log(
        `%c${profilerId} ${phase}`,
        'color: #7B68EE; font-weight: bold;',
        `\nActual: ${actualDuration.toFixed(2)}ms, Base: ${baseDuration.toFixed(2)}ms`,
        metric
      );
      
      // Update metrics state
      setMetrics(prev => [...prev.slice(-19), metric]);
    },
    [enabled, onlySlowRenders, slowRenderThreshold]
  );
  
  const toggleOverlay = useCallback(() => {
    setShowOverlay(prev => !prev);
  }, []);
  
  // If profiling is disabled, just render children
  if (!enabled) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Profiler id={id} onRender={handleRender}>
        {children}
      </Profiler>
      
      {/* Floating toggle button (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={toggleOverlay}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full z-50 shadow-lg"
          style={{ width: '36px', height: '36px', fontSize: '12px' }}
          title="Toggle performance overlay"
        >
          PRF
        </button>
      )}
      
      {/* Performance metrics overlay */}
      {showOverlay && (
        <div className="fixed bottom-16 right-4 bg-black/80 text-white p-4 rounded-lg z-50 shadow-lg max-w-xs max-h-96 overflow-auto">
          <h4 className="text-sm font-bold mb-2">Performance Metrics</h4>
          
          {metrics.length === 0 ? (
            <p className="text-xs text-gray-400">No slow renders detected yet</p>
          ) : (
            <ul className="space-y-2">
              {metrics.map((metric, idx) => (
                <li key={idx} className="text-xs border-b border-gray-700 pb-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{metric.id}</span>
                    <span className={metric.actualDuration > 15 ? 'text-red-400' : 'text-green-400'}>
                      {metric.actualDuration.toFixed(2)}ms
                    </span>
                  </div>
                  <div className="text-gray-400">
                    {metric.phase} • base: {metric.baseDuration.toFixed(2)}ms
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <div className="mt-3 text-xs text-gray-400">
            Threshold: {slowRenderThreshold}ms
          </div>
        </div>
      )}
    </>
  );
};

export default ReactProfiler;
