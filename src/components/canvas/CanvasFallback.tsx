
import React from 'react';

interface CanvasFallbackProps {
  error: Error;
  retry: () => void;
  width?: number;
  height?: number;
  showDiagnostics?: boolean;
}

const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  error,
  retry,
  width = 800,
  height = 600,
  showDiagnostics = true
}) => {
  return (
    <div 
      className="flex items-center justify-center bg-red-50 border border-red-300 rounded-lg"
      style={{ width, height }}
    >
      <div className="max-w-md p-4 text-center">
        <h3 className="text-lg font-medium text-red-800">Canvas Error</h3>
        <p className="mt-2 text-red-700">{error.message}</p>
        
        {showDiagnostics && (
          <div className="mt-4 p-2 bg-red-100 text-left text-sm rounded">
            <p className="font-semibold">Diagnostic Info:</p>
            <pre className="mt-1 whitespace-pre-wrap text-xs">
              {error.stack || "No stack trace available"}
            </pre>
          </div>
        )}
        
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default CanvasFallback;
