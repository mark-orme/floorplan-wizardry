
import React from 'react';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DebugPanelProps {
  debugInfo: DebugInfoState;
}

/**
 * Debug panel for displaying canvas state
 * @param {DebugPanelProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({
  debugInfo
}: DebugPanelProps): JSX.Element => {
  return (
    <div className="absolute bottom-4 right-4 w-80 z-50">
      <Card className="bg-gray-900 text-white border-gray-700">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm flex items-center justify-between">
            Canvas Debug Info
            <Badge variant="outline" className="ml-2">
              DEV
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Canvas Initialized:</div>
            <div>{debugInfo.canvasInitialized ? "✅" : "❌"}</div>
            
            <div>Dimensions Set:</div>
            <div>{debugInfo.dimensionsSet ? "✅" : "❌"}</div>
            
            <div>Grid Created:</div>
            <div>{debugInfo.gridCreated ? "✅" : "❌"}</div>
            
            <div>Event Handlers:</div>
            <div>{debugInfo.eventHandlersSet ? "✅" : "❌"}</div>
            
            <div>Canvas Width:</div>
            <div>{debugInfo.canvasDimensions?.width ?? 0}px</div>
            
            <div>Canvas Height:</div>
            <div>{debugInfo.canvasDimensions?.height ?? 0}px</div>
            
            <div>Grid Objects:</div>
            <div>{debugInfo.gridObjectCount}</div>
            
            <div>Has Error:</div>
            <div>{debugInfo.hasError ? "❌ Yes" : "✅ No"}</div>
          </div>
          
          {debugInfo.hasError && (
            <div className="mt-2 p-2 bg-red-900/50 rounded text-red-200">
              {debugInfo.errorMessage}
            </div>
          )}
          
          <div className="mt-2 text-gray-400">
            Last Init: {debugInfo.lastInitTime && debugInfo.lastInitTime > 0 ? `${Date.now() - debugInfo.lastInitTime}ms ago` : 'N/A'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
