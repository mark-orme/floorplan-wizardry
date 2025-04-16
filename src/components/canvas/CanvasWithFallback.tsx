import React, { useState, useEffect } from 'react';
import { Canvas, CanvasProps } from '@/components/Canvas';
import { CanvasFallback } from '@/components/canvas/CanvasFallback';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { captureMessage } from '@/utils/sentryUtils';
import logger from '@/utils/logger';
import { Canvas as FabricCanvas } from 'fabric';

export interface CanvasWithFallbackProps extends CanvasProps {
  /** Additional class name for container */
  className?: string;
  /** Whether to show diagnostic information in fallback */
  showDiagnostics?: boolean;
  /** Max retry attempts before showing fallback permanently */
  maxRetries?: number;
  /** Callback when canvas is initialized */
  onCanvasInitialized?: (canvas: FabricCanvas) => void;
}

/**
 * Enhanced Canvas component with automatic error handling and fallback
 * This component wraps the standard Canvas with reliable error handling
 */
export const CanvasWithFallback: React.FC<CanvasWithFallbackProps> = ({
  className,
  showDiagnostics = true,
  maxRetries = 3,
  onCanvasInitialized,
  ...canvasProps
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  
  // Use our enhanced canvas initialization hook
  useCanvasInit({
    onError: () => {
      // The hook detected an error, but we'll wait for the actual Canvas component
      // to report it to avoid duplicate handling
      logger.info("Canvas initialization error detected by hook");
    }
  });
  
  // Reset error state when dimensions change
  useEffect(() => {
    if (canvasProps.width && canvasProps.height) {
      setError(null);
      setShowFallback(false);
    }
  }, [canvasProps.width, canvasProps.height]);
  
  // Handle canvas error
  const handleCanvasError = (err: Error) => {
    logger.error("Canvas error:", err);
    setError(err);
    setRetryCount(prev => prev + 1);
    
    // Show fallback after max retries
    if (retryCount >= maxRetries - 1) {
      setShowFallback(true);
    }
    
    // Pass to original error handler if provided
    if (canvasProps.onError) {
      canvasProps.onError(err);
    }
  };
  
  // Handle retry from fallback
  const handleRetry = () => {
    // Check if we've exceeded max retries
    if (retryCount >= maxRetries * 2) {
      logger.warn("Too many retry attempts, suggesting page refresh");
      captureMessage("User attempted too many canvas retries", "canvas-retry-limit", {
        level: "warning",
        extra: {
          retryCount,
          error: error?.message,
          maxRetries
        }
      });
      return;
    }
    
    // Reset state
    setShowFallback(false);
    setError(null);
    
    // Force remount by using a key
    setRetryCount(prev => prev + 1);
    
    logger.info("User initiated canvas retry:", retryCount + 1);
  };
  
  // Handle canvas ready
  const handleCanvasReady = (canvas: FabricCanvas) => {
    // Call original onCanvasReady if provided
    if (canvasProps.onCanvasReady) {
      canvasProps.onCanvasReady(canvas);
    }
    
    // Call onCanvasInitialized if provided
    if (onCanvasInitialized) {
      onCanvasInitialized(canvas);
    }
  };
  
  // If we're showing the fallback, render it
  if (showFallback) {
    return (
      <CanvasFallback
        error={error}
        onRetry={handleRetry}
        width={canvasProps.width}
        height={canvasProps.height}
        showDiagnostics={showDiagnostics}
      />
    );
  }
  
  // Otherwise render the canvas with error catching
  return (
    <div className={className} data-testid="canvas-with-fallback" data-retry-count={retryCount}>
      <Canvas 
        {...canvasProps}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
        key={`canvas-instance-${retryCount}`}
      />
    </div>
  );
};
