
import React from 'react';
import { DebugInfoState } from '@/types/core/DebugInfo';

interface DebugInfoProps {
  debugInfo: DebugInfoState;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ debugInfo }) => {
  // Render only the available properties
  return (
    <div>
      <div>Canvas Ready: {debugInfo.canvasReady ? "Yes" : "No"}</div>
      <div>Canvas Initialized: {debugInfo.canvasInitialized ? "Yes" : "No"}</div>
      <div>Canvas Created: {debugInfo.canvasCreated ? "Yes" : "No"}</div>
      <div>Dimensions Set: {debugInfo.dimensionsSet ? "Yes" : "No"}</div>
      <div>Error Count: {debugInfo.errorCount}</div>
      <div>Last Error: {debugInfo.lastError}</div>
      <div>Logs: {debugInfo.logs && debugInfo.logs.length}</div>
      <div>Metrics: {JSON.stringify(debugInfo.metrics)}</div>
    </div>
  );
};

export default DebugInfo;
