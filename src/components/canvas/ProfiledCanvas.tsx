
/**
 * ProfiledCanvas Component
 * 
 * Canvas component wrapped with React Profiler for performance monitoring.
 * Use this in development to detect performance issues.
 */
import React from 'react';
import { Canvas, CanvasProps } from '../Canvas';
import ReactProfiler from '../debug/ReactProfiler';

export const ProfiledCanvas: React.FC<CanvasProps & { enableProfiling?: boolean }> = ({
  enableProfiling = process.env.NODE_ENV === 'development',
  ...canvasProps
}) => {
  // Only use profiler in development mode
  if (!enableProfiling || process.env.NODE_ENV !== 'development') {
    return <Canvas {...canvasProps} />;
  }
  
  return (
    <ReactProfiler
      id="Canvas"
      slowRenderThreshold={10}
      onlySlowRenders={true}
    >
      <Canvas {...canvasProps} />
    </ReactProfiler>
  );
};

export default ProfiledCanvas;
