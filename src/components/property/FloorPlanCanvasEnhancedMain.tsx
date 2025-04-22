
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { CanvasControllerEnhanced } from '@/components/canvas/controller/CanvasControllerEnhanced';

interface FloorPlanCanvasEnhancedMainProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  showPerformanceMetrics?: boolean;
  showSecurityInfo?: boolean;
}

export const FloorPlanCanvasEnhancedMain: React.FC<FloorPlanCanvasEnhancedMainProps> = ({
  width,
  height,
  onCanvasReady,
  onCanvasError,
  showPerformanceMetrics = false,
  showSecurityInfo = false
}) => {
  return (
    <div className="floor-plan-canvas-enhanced-main">
      <CanvasControllerEnhanced
        width={width}
        height={height}
        onCanvasReady={onCanvasReady}
        onError={onCanvasError}
        showDebug={showPerformanceMetrics}
      />
      
      {showSecurityInfo && (
        <div className="mt-2 text-xs text-gray-500">
          Secure canvas with XSS protection and CSRF mitigation
        </div>
      )}
    </div>
  );
};
