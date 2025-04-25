
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCw } from "@/components/ui/icons";
import { toast } from '@/utils/toastUtils';
import { DebugInfoState } from '@/types/core/DebugInfo';

interface CanvasFallbackProps {
  error?: Error;
  retry: () => void;
  errorMessage?: string;
  width?: number;
  height?: number;
  showDiagnostics?: boolean;
}

const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  error,
  retry,
  errorMessage,
  width = 800,
  height = 600,
  showDiagnostics = false
}) => {
  const handleRetry = () => {
    toast.info("Retrying canvas initialization...");
    retry();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
      <div className="text-center p-4 max-w-md">
        <h3 className="font-semibold text-lg text-red-600 mb-2">Canvas Error</h3>
        
        {errorMessage && (
          <p className="text-gray-600 mb-4 text-sm">
            {errorMessage}
          </p>
        )}
        
        {error && (
          <p className="text-gray-600 mb-4 text-sm">
            {error.message}
          </p>
        )}
        
        <div className="text-sm text-gray-500 mb-4">
          <p>The drawing canvas could not be initialized. This may be due to:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Low memory or resources</li>
            <li>Browser compatibility issues</li>
            <li>Web GL not supported</li>
          </ul>
        </div>
        
        <Button onClick={handleRetry} variant="default">
          <RotateCw className="w-4 h-4 mr-2" />
          Retry Loading Canvas
        </Button>
      </div>
    </div>
  );
};

export default CanvasFallback;
