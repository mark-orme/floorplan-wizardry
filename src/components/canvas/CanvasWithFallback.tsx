
import React, { useState, useEffect } from 'react';
import CanvasFallback from "@/components/canvas/CanvasFallback";
import { Canvas, CanvasProps } from '@/components/Canvas';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { captureMessage } from '@/utils/sentryUtils';
import logger from '@/utils/logger';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

export { default as CanvasFallback } from '@/components/canvas/CanvasFallback';

export interface CanvasWithFallbackProps extends CanvasProps {
  /** Additional class name for container */
  className?: string;
  /** Whether to show diagnostic information in fallback */
  showDiagnostics?: boolean;
  /** Max retry attempts before showing fallback permanently */
  maxRetries?: number;
  /** Callback when canvas is initialized */
  onCanvasInitialized?: (canvas: ExtendedFabricCanvas) => void;
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
  width,
  height,
  onCanvasReady,
  onError,
  showGridDebug,
  ...otherProps
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
    if (width && height) {
      setError(null);
      setShowFallback(false);
    }
  }, [width, height]);
  
  // Handle canvas error
  const handleCanvasError = (err: Error) => {
    logger.error("Canvas error:", { error: err });
    setError(err);
    setRetryCount(prev => prev + 1);
    
    // Show fallback after max retries
    if (retryCount >= maxRetries - 1) {
      setShowFallback(true);
    }
    
    // Pass to original error handler if provided
    if (onError) {
      onError(err);
    }
  };
  
  // Handle retry from fallback
  const handleRetry = () => {
    // Check if we've exceeded max retries
    if (retryCount >= maxRetries * 2) {
      logger.warn("Too many retry attempts, suggesting page refresh", { retryCount });
      captureMessage("User attempted too many canvas retries", {
        level: "warning",
        tags: { component: "canvas-retry-limit" },
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
    
    logger.info("User initiated canvas retry:", { count: retryCount + 1 });
  };
  
  // Handle canvas ready
  const handleCanvasReady = (canvas: ExtendedFabricCanvas) => {
    // Call original onCanvasReady if provided
    if (onCanvasReady) {
      onCanvasReady(canvas);
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
        error={error!}
        retry={handleRetry}
        width={width}
        height={height}
        showDiagnostics={showDiagnostics}
      />
    );
  }
  
  // Otherwise render the canvas with error catching
  return (
    <div className={className} data-testid="canvas-with-fallback" data-retry-count={retryCount}>
      <Canvas 
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
        showGridDebug={showGridDebug}
        key={`canvas-instance-${retryCount}`}
        {...otherProps}
      />
    </div>
  );
};
