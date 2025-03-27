
/**
 * Custom hook for managing canvas dimensions
 * @module hooks/canvas/useCanvasDimensions
 */
import { useState, useEffect, useRef } from 'react';

interface UseCanvasDimensionsProps {
  /** Reference to the canvas element */
  canvasReference: React.RefObject<HTMLCanvasElement>;
  /** Reference to the container element */
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook for managing canvas dimensions and initialization state
 * @param {UseCanvasDimensionsProps} props - Hook properties
 * @returns Canvas dimension state and utility functions
 */
export const useCanvasDimensions = ({
  canvasReference,
  containerRef
}: UseCanvasDimensionsProps) => {
  const [canvasReady, setCanvasReady] = useState(false);
  const [dimensionsSetupAttempt, setDimensionsSetupAttempt] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  // Set up canvas dimensions when the component mounts
  useEffect(() => {
    if (!canvasReference.current || !containerRef.current) {
      return;
    }

    // Mark canvas as ready
    setCanvasReady(true);

    // Reset the timer
    startTimeRef.current = Date.now();
  }, [canvasReference, containerRef]);

  return {
    canvasReady,
    dimensionsSetupAttempt,
    setDimensionsSetupAttempt,
    startTimeRef
  };
};
