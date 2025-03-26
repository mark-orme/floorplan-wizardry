
import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle, Bug, Download } from 'lucide-react';
import logger from '@/utils/logger';
import { captureError } from '@/utils/sentryUtils';
import { toast } from 'sonner';

interface EmergencyCanvasProps {
  onRetry?: () => void;
  width?: number;
  height?: number;
  diagnosticData?: Record<string, any>;
}

/**
 * Simplified backup canvas component when the main canvas fails
 * This component has minimal dependencies and renders a static grid
 * without using Fabric.js to avoid initialization loops
 */
export const EmergencyCanvas: React.FC<EmergencyCanvasProps> = ({ 
  onRetry,
  width = 800,
  height = 600,
  diagnosticData = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGridRendered, setIsGridRendered] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [canRetry, setCanRetry] = useState(true);
  
  // Check if retry is blocked by initialization attempts counter
  useEffect(() => {
    // Look for specific error patterns that indicate a retry would be pointless
    const errorHistory = diagnosticData.errorStack || [];
    const isBlocked = errorHistory.some((err: string) => 
      err.includes('Too many canvas initialization attempts') ||
      err.includes('Canvas initialization blocked')
    );
    
    if (isBlocked) {
      setCanRetry(false);
      toast.warning("Canvas initialization is blocked. Please refresh the page to try again.", {
        id: "canvas-blocked",
        duration: 5000
      });
    }
  }, [diagnosticData]);
  
  // Draw a simple grid using plain Canvas API
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      logger.info('Initializing emergency canvas');
      
      // Report to Sentry that emergency canvas was used
      captureError(
        new Error('Emergency canvas activated'),
        'emergency-canvas-fallback',
        {
          level: 'warning',
          extra: {
            diagnosticData,
            timestamp: new Date().toISOString()
          }
        }
      );
      
      // Set dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Get rendering context
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        logger.error('Failed to get canvas context');
        return;
      }
      
      // Clear canvas and set background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);
      
      // Draw grid lines
      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 0.5;
      
      // Draw vertical lines every 20px
      for (let x = 0; x <= width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Draw horizontal lines every 20px
      for (let y = 0; y <= height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw major grid lines
      ctx.strokeStyle = '#aaaaaa';
      ctx.lineWidth = 1;
      
      // Draw vertical lines every 100px
      for (let x = 0; x <= width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        // Add labels
        if (x > 0) {
          ctx.fillStyle = '#666666';
          ctx.font = '10px sans-serif';
          ctx.fillText(`${x}px`, x + 2, 10);
        }
      }
      
      // Draw horizontal lines every 100px
      for (let y = 0; y <= height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        
        // Add labels
        if (y > 0) {
          ctx.fillStyle = '#666666';
          ctx.font = '10px sans-serif';
          ctx.fillText(`${y}px`, 2, y - 2);
        }
      }
      
      // Add emergency mode message
      ctx.fillStyle = 'rgba(220, 53, 69, 0.9)';
      ctx.font = 'bold 20px sans-serif';
      const mainText = 'EMERGENCY MODE';
      const textWidth = ctx.measureText(mainText).width;
      ctx.fillText(mainText, (width - textWidth) / 2, height / 2 - 15);
      
      // Add explanation
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.font = '14px sans-serif';
      
      // Choose the appropriate message based on retry availability
      const subText = canRetry 
        ? 'Canvas initialization failed. Using simplified mode.' 
        : 'Canvas blocked. Please refresh the page.';
      
      const subTextWidth = ctx.measureText(subText).width;
      ctx.fillText(subText, (width - subTextWidth) / 2, height / 2 + 15);
      
      // Add diagnostic message
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.font = '12px sans-serif';
      const diagText = 'Click "Debug Info" for details.';
      const diagWidth = ctx.measureText(diagText).width;
      ctx.fillText(diagText, (width - diagWidth) / 2, height / 2 + 40);
      
      // Mark as rendered successfully
      setIsGridRendered(true);
      logger.info('Emergency canvas initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize emergency canvas:', error);
      captureError(error, 'emergency-canvas-init-error', {
        level: 'error',
        extra: { diagnosticData }
      });
    }
  }, [width, height, diagnosticData, canRetry]);
  
  const toggleDebugInfo = () => {
    setShowDebug(prev => !prev);
  };
  
  // Function to download diagnostic data for debugging
  const downloadDiagnosticData = () => {
    try {
      const dataStr = JSON.stringify(diagnosticData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `canvas-diagnostics-${new Date().toISOString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      toast.success('Diagnostic data downloaded');
    } catch (error) {
      toast.error('Failed to download diagnostic data');
      console.error('Error downloading diagnostic data:', error);
    }
  };
  
  return (
    <div className="relative">
      <Card className="p-0 bg-white shadow-md rounded-lg overflow-visible">
        <div className="w-full h-full relative" style={{ minHeight: '600px' }}>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full border border-gray-100 rounded-md"
            style={{ display: "block" }}
            data-testid="emergency-canvas"
          />
        </div>
      </Card>
      
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Canvas Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            {canRetry 
              ? "The main canvas failed to initialize after multiple attempts. Using simplified backup mode."
              : "Canvas initialization is blocked due to too many failed attempts. Please refresh the page."}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Note: Drawing functionality is limited in emergency mode.
          </p>
          <div className="flex gap-3 mt-4">
            {canRetry && (
              <Button 
                variant="outline" 
                onClick={onRetry} 
                className="flex items-center gap-2"
                disabled={!isGridRendered}
              >
                <RefreshCw size={16} />
                Retry with main canvas
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={toggleDebugInfo}
              className="flex items-center gap-2"
              size="sm"
            >
              <Bug size={16} />
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={downloadDiagnosticData}
              className="flex items-center gap-2"
              size="sm"
            >
              <Download size={16} />
              Download Diagnostics
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      {showDebug && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-xs font-mono max-h-60 overflow-auto">
          <h3 className="font-bold text-gray-700 mb-2">Debug Information:</h3>
          <pre>{JSON.stringify(diagnosticData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
