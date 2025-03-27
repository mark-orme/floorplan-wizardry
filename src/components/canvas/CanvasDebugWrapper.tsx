
/**
 * Canvas Debug Wrapper Component
 * Conditionally displays debug information for canvas initialization
 * @module canvas/CanvasDebugWrapper
 */
import React from 'react';
import { DebugInfoState } from '@/types';

interface CanvasDebugWrapperProps {
  /** Debug information state */
  debugInfo: DebugInfoState;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Number of dimension setup attempts */
  dimensionsSetupAttempt: number;
  /** Initialization start time */
  startTime: number;
  /** Optional children elements */
  children?: React.ReactNode;
}

/**
 * Canvas Debug Wrapper component
 * Displays debug information for canvas initialization
 * @param {CanvasDebugWrapperProps} props - Component properties
 * @returns {JSX.Element | null} Rendered component or null if debug is disabled
 */
export const CanvasDebugWrapper: React.FC<CanvasDebugWrapperProps> = ({
  debugInfo,
  canvasReady,
  dimensionsSetupAttempt,
  startTime,
  children
}) => {
  // Only show in development mode and when debug is enabled
  if (process.env.NODE_ENV !== 'development' || !debugInfo.showDebugInfo) {
    return null;
  }

  // Calculate initialization time if applicable
  const initTime = startTime > 0 ? (Date.now() - startTime) : 0;

  return (
    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs p-1 rounded z-50 pointer-events-none">
      <div>Canvas Ready: {canvasReady ? 'Yes' : 'No'}</div>
      <div>Setup Attempts: {dimensionsSetupAttempt}</div>
      <div>Init Time: {initTime}ms</div>
      <div>Canvas Initialized: {debugInfo.canvasInitialized ? 'Yes' : 'No'}</div>
      <div>Dimensions Set: {debugInfo.dimensionsSet ? 'Yes' : 'No'}</div>
      {children}
    </div>
  );
};
