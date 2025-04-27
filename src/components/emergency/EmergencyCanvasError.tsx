
import React from 'react';
import { Button } from '@/components/ui/button';
import { DebugInfoState } from '@/types/core/DebugInfo';

interface EmergencyCanvasErrorProps {
  onRetry: () => void;
  width: number;
  height: number;
  diagnosticData: {
    errorMessage: string;
    debugInfo: DebugInfoState;
    initTime: number;
    retryAttempts: number;
    timestamp: string;
    canvasBlocked: boolean;
  };
  forceDisableRetry: boolean;
}

export const EmergencyCanvasError: React.FC<EmergencyCanvasErrorProps> = ({
  onRetry,
  width,
  height,
  diagnosticData,
  forceDisableRetry
}) => {
  const { errorMessage, retryAttempts, timestamp } = diagnosticData;
  
  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-md p-4 flex flex-col items-center justify-center text-center"
      style={{ width, height }}
    >
      <h3 className="text-lg font-semibold text-red-700 mb-2">Canvas Error</h3>
      <p className="text-sm text-red-600 mb-4">{errorMessage || "Failed to initialize canvas"}</p>
      
      <div className="text-xs text-gray-500 mb-4">
        <p>Retry attempts: {retryAttempts}</p>
        <p>Time: {timestamp}</p>
      </div>
      
      <Button 
        onClick={onRetry}
        disabled={forceDisableRetry || retryAttempts > 5}
        variant="outline"
        className="bg-white"
      >
        Try Again
      </Button>
    </div>
  );
};

export default EmergencyCanvasError;
