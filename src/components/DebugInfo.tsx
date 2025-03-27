
import { DebugInfoState } from "@/types";

interface DebugInfoProps {
  debugInfo: DebugInfoState;
}

/**
 * Displays debug information about the canvas state
 * @param {DebugInfoProps} props - Component properties
 * @returns {JSX.Element} Debug information component
 */
export const DebugInfo = ({ debugInfo }: DebugInfoProps): JSX.Element => {
  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return <></>;
  }

  return (
    <div className="mt-4 p-2 text-xs bg-gray-100 rounded-md overflow-auto max-h-32">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h3 className="font-bold">Canvas State</h3>
          <p>Initialized: {debugInfo.canvasInitialized ? "✅" : "❌"}</p>
          <p>Grid Created: {debugInfo.gridCreated ? "✅" : "❌"}</p>
          <p>Dimensions Set: {debugInfo.dimensionsSet ? "✅" : "❌"}</p>
          <p>Brush Initialized: {debugInfo.brushInitialized ? "✅" : "❌"}</p>
          <p>
            Grid Objects: {debugInfo.gridObjects ?? 'N/A'} / Canvas Objects: {debugInfo.canvasObjects ?? 'N/A'}
          </p>
          <p>
            Canvas Size: {debugInfo.canvasWidth ?? 'N/A'}x{debugInfo.canvasHeight ?? 'N/A'} (DPR: {debugInfo.devicePixelRatio ?? 'N/A'})
          </p>
        </div>
        
        <div>
          <h3 className="font-bold">Performance Metrics</h3>
          <p>FPS: {debugInfo.performanceStats?.fps?.toFixed(1) || 'N/A'}</p>
          <p>Dropped Frames: {debugInfo.performanceStats?.droppedFrames || 0}</p>
          <p>Avg Frame Time: {debugInfo.performanceStats?.frameTime?.toFixed(2) || 'N/A'}ms</p>
          <p>Max Frame Time: {debugInfo.performanceStats?.maxFrameTime?.toFixed(2) || 'N/A'}ms</p>
          <p>Long Frames: {debugInfo.performanceStats?.longFrames || 0}</p>
          {debugInfo.lastError && (
            <p className="text-red-500">
              Error: {String(debugInfo.lastError)} ({new Date(debugInfo.lastErrorTime || 0).toLocaleTimeString()})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
