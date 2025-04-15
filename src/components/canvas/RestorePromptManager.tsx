
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useRestorePrompt } from '@/hooks/useRestorePrompt';
import { RestoreDrawingPrompt } from './RestoreDrawingPrompt';

interface RestorePromptManagerProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  onRestore: (success: boolean) => void;
}

/**
 * Manages restore prompt for the canvas
 */
export const RestorePromptManager: React.FC<RestorePromptManagerProps> = ({
  canvas,
  canvasId,
  onRestore
}) => {
  // Initialize restore prompt hook
  const { 
    showPrompt, 
    timeElapsed, 
    isRestoring, 
    handleRestore, 
    handleDismiss 
  } = useRestorePrompt({
    canvas,
    canvasId,
    onRestore
  });

  // If prompt shouldn't be shown, don't render anything
  if (!showPrompt) return null;

  return (
    <RestoreDrawingPrompt
      timeElapsed={timeElapsed}
      onRestore={onRestore}
      onDismiss={handleDismiss}
      isRestoring={isRestoring}
    />
  );
};
