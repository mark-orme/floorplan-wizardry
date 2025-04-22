
import { useEffect, useState, useRef } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

/**
 * A hook that observes and returns the dimensions of a DOM element
 * @param elementRef - Reference to the element to observe
 * @returns Current dimensions of the element
 */
const useResizeObserver = <T extends HTMLElement>(
  elementRef: React.RefObject<T>
): Dimensions | undefined => {
  const [dimensions, setDimensions] = useState<Dimensions>();
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create the observer instance
    observerRef.current = new ResizeObserver(entries => {
      if (entries.length === 0) return;
      
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      
      setDimensions({ width, height });
    });

    // Start observing
    observerRef.current.observe(element);

    // Cleanup when component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementRef]);

  return dimensions;
};

export default useResizeObserver;
