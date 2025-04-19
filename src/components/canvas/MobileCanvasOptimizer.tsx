
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { MobileCanvasEnhancer } from './MobileCanvasEnhancer';

interface MobileCanvasOptimizerProps {
  canvas: FabricCanvas;
}

/**
 * Component that applies mobile-specific optimizations to canvas
 * Acts as a proxy to MobileCanvasEnhancer for backward compatibility
 */
export const MobileCanvasOptimizer: React.FC<MobileCanvasOptimizerProps> = ({ canvas }) => {
  useEffect(() => {
    logger.info('Initializing mobile canvas optimizations via MobileCanvasOptimizer');
  }, [canvas]);

  // Use the MobileCanvasEnhancer component for actual implementation
  return <MobileCanvasEnhancer canvas={canvas} />;
};

export default MobileCanvasOptimizer;
