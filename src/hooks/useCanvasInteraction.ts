
import { useCallback, useState } from 'react';

export interface CanvasInteractionOptions {
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export const useCanvasInteraction = (options: CanvasInteractionOptions = {}) => {
  const [isInteracting, setIsInteracting] = useState(false);

  const startInteraction = useCallback(() => {
    setIsInteracting(true);
    options.onInteractionStart?.();
  }, [options]);

  const endInteraction = useCallback(() => {
    setIsInteracting(false);
    options.onInteractionEnd?.();
  }, [options]);

  return {
    isInteracting,
    startInteraction,
    endInteraction
  };
};
