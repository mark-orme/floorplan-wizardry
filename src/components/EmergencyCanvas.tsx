
import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import logger from '@/utils/logger';

interface EmergencyCanvasProps {
  onRetry?: () => void;
  width?: number;
  height?: number;
}

/**
 * Simplified backup canvas component when the main canvas fails
 * This component has minimal dependencies and renders a static grid
 * without using Fabric.js to avoid initialization loops
 */
export const EmergencyCanvas: React.FC<EmergencyCanvasProps> = ({ 
  onRetry,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGridRendered, setIsGridRendered] = useState(false);
  
  // Draw a simple grid using plain Canvas API
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      logger.info('Initializing emergency canvas');
      
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
      const subText = 'Canvas initialization failed. Using simplified mode.';
      const subTextWidth = ctx.measureText(subText).width;
      ctx.fillText(subText, (width - subTextWidth) / 2, height / 2 + 15);
      
      // Mark as rendered successfully
      setIsGridRendered(true);
      logger.info('Emergency canvas initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize emergency canvas:', error);
    }
  }, [width, height]);
  
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
            The main canvas failed to initialize after multiple attempts. Using simplified backup mode.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Note: Drawing functionality is limited in emergency mode.
          </p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={onRetry} 
              className="flex items-center gap-2"
              disabled={!isGridRendered}
            >
              <RefreshCw size={16} />
              Retry with main canvas
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
