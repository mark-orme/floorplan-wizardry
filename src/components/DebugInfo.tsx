
interface DebugInfoProps {
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
}

export const DebugInfo = ({ debugInfo }: DebugInfoProps) => {
  return (
    <div className="text-xs mt-2 text-gray-500 grid grid-cols-2 gap-1 border-t pt-2">
      <div>Canvas Initialized: {debugInfo.canvasInitialized ? '✅' : '❌'}</div>
      <div>Grid Created: {debugInfo.gridCreated ? '✅' : '❌'}</div>
      <div>Dimensions Set: {debugInfo.dimensionsSet ? '✅' : '❌'}</div>
      <div>Brush Initialized: {debugInfo.brushInitialized ? '✅' : '❌'}</div>
    </div>
  );
};
