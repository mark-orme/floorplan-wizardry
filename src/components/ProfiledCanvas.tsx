
/**
 * Performance-profiled Canvas component wrapper
 * Measures and reports render performance
 * @module ProfiledCanvas
 */
import { Profiler, ProfilerOnRenderCallback } from 'react';
import { Canvas, CanvasProps } from './Canvas';
import { profileRender } from '@/utils/performance';

interface ProfiledCanvasProps extends CanvasProps {
  /** Custom profiler id */
  profilerId?: string;
  /** Custom profiler callback */
  onRender?: ProfilerOnRenderCallback;
}

/**
 * Canvas component wrapped with React Profiler
 * Use this in development to monitor rendering performance
 * @param {ProfiledCanvasProps} props - Component props
 * @returns {JSX.Element} Profiled Canvas component
 */
export const ProfiledCanvas = ({ 
  profilerId = 'Canvas', 
  onRender = profileRender,
  ...canvasProps
}: ProfiledCanvasProps) => {
  return (
    <Profiler id={profilerId} onRender={onRender}>
      <Canvas {...canvasProps} />
    </Profiler>
  );
};
