
/**
 * Performance-profiled Canvas component wrapper
 * Measures and reports render performance
 * @module ProfiledCanvas
 */
import { Profiler, ProfilerOnRenderCallback } from 'react';
import { Canvas } from './Canvas';
import { profileRender } from '@/utils/performance';

interface ProfiledCanvasProps {
  /** Custom profiler id */
  id?: string;
  /** Custom profiler callback */
  onRender?: ProfilerOnRenderCallback;
}

/**
 * Canvas component wrapped with React Profiler
 * Use this in development to monitor rendering performance
 * @param {ProfiledCanvasProps} props - Component props
 * @returns {JSX.Element} Profiled Canvas component
 */
export const ProfiledCanvas = ({ id = 'Canvas', onRender = profileRender }: ProfiledCanvasProps) => {
  return (
    <Profiler id={id} onRender={onRender}>
      <Canvas />
    </Profiler>
  );
};
