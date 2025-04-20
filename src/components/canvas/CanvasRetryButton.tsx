
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasRetryButtonProps {
  errorMessage: string | null;
  onRetry: () => void;
}

export const CanvasRetryButton: React.FC<CanvasRetryButtonProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-md p-4">
      <p className="text-red-500 mb-2">Canvas initialization failed.</p>
      
      {errorMessage && (
        <p className="text-sm text-gray-700 mb-4">Error: {errorMessage}</p>
      )}
      
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};

export default CanvasRetryButton;
