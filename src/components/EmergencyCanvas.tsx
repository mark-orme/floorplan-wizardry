
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toastUtils'; // Use our mock implementation
import { RefreshCcw } from "lucide-react";
import { DebugInfoState } from '@/types/core/DebugInfo';

interface EmergencyCanvasProps {
  onRetry?: () => void;
  error?: Error;
  width?: number;
  height?: number;
  diagnosticData?: {
    errorMessage: string;
    debugInfo: DebugInfoState;
    initTime: number;
    retryAttempts: number;
    timestamp: string;
    canvasBlocked: boolean;
  };
  forceDisableRetry?: boolean;
}

export const EmergencyCanvas: React.FC<EmergencyCanvasProps> = ({
  onRetry,
  error,
  width = 800,
  height = 600,
  diagnosticData,
  forceDisableRetry = false
}) => {
  const handleRetry = () => {
    toast.info("Retrying canvas initialization...");
    onRetry?.();
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-red-600">Canvas Error</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error?.message || diagnosticData?.errorMessage || "The canvas encountered an error and couldn't be loaded."}
          </p>
          
          {diagnosticData && (
            <div className="text-xs bg-gray-50 p-2 rounded border">
              <p className="font-semibold">Diagnostic Information:</p>
              <p>Retry Attempts: {diagnosticData.retryAttempts}</p>
              <p>Timestamp: {diagnosticData.timestamp}</p>
              {diagnosticData.debugInfo && (
                <p>Canvas Ready: {diagnosticData.debugInfo.canvasReady ? 'Yes' : 'No'}</p>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleRetry}
            className="w-full"
            variant="outline"
            disabled={forceDisableRetry}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Loading Canvas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
