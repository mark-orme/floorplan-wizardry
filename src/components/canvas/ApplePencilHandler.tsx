
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useApplePencilSupport } from '@/hooks/useApplePencilSupport';
import { toast } from 'sonner';

interface ApplePencilHandlerProps {
  canvas: FabricCanvas | null;
  lineThickness?: number;
  showToastOnDetection?: boolean;
}

export const ApplePencilHandler: React.FC<ApplePencilHandlerProps> = ({
  canvas,
  lineThickness = 2,
  showToastOnDetection = true
}) => {
  const {
    isApplePencil,
    isPencilDetected,
    pressure,
    adjustedLineThickness,
    setupPencilSupport
  } = useApplePencilSupport({
    canvas,
    lineThickness
  });
  
  // Set up pencil support when component mounts
  useEffect(() => {
    if (canvas) {
      setupPencilSupport();
    }
  }, [canvas, setupPencilSupport]);
  
  // Show toast when Apple Pencil is detected
  useEffect(() => {
    if (isApplePencil && showToastOnDetection) {
      toast.success('Apple Pencil detected!', {
        id: 'apple-pencil-detected',
        duration: 2000
      });
      
      // Add pencil active class to body
      document.body.classList.add('pencil-active');
      
      return () => {
        document.body.classList.remove('pencil-active');
      };
    }
  }, [isApplePencil, showToastOnDetection]);
  
  // Show support status when component mounts
  useEffect(() => {
    if (isPencilDetected && showToastOnDetection) {
      toast.info('Apple Pencil support is enabled. Press lightly for thinner lines, firmly for thicker lines.', {
        id: 'apple-pencil-support',
        duration: 5000
      });
    }
  }, [isPencilDetected, showToastOnDetection]);
  
  // Don't render anything - this is just a behavior component
  return null;
};
