import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw as RefreshCw } from "lucide-react";
import { toast } from '@/utils/toastUtils'; // Use our mock implementation
import { DebugInfoState } from '@/types/core/DebugInfo';

interface CanvasFallbackProps {
  errorMessage?: string;
  onRetry: () => void;
}

const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  errorMessage,
  onRetry
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
      <div className="text-center p-4 max-w-md">
        <h3 className="font-semibold text-lg text-red-600 mb-2">Canvas Error</h3>
        
        {errorMessage && (
          <p className="text-gray-600 mb-4 text-sm">
            {errorMessage}
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
        
        <Button onClick={onRetry} variant="default">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Loading Canvas
        </Button>
      </div>
    </div>
  );
};

export default CanvasFallback;
