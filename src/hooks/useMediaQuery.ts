
/**
 * Custom hook for responsive design with media queries
 * @module hooks/useMediaQuery
 */
import { useState, useEffect } from 'react';

/**
 * Hook for detecting media query matches
 * @param query Media query string to match
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Check if window is defined (to support SSR)
  const isClient = typeof window === 'object';
  
  // Create state with initial value based on media query
  const [matches, setMatches] = useState<boolean>(() => {
    if (!isClient) return false;
    return window.matchMedia(query).matches;
  });
  
  // Effect to set up media query listener and cleanup
  useEffect(() => {
    if (!isClient) return;
    
    const mediaQuery = window.matchMedia(query);
    
    // Handler for media query change events
    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };
    
    // Set initial state
    setMatches(mediaQuery.matches);
    
    // Add event listener (using the correct API based on browser support)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup event listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query, isClient]);
  
  return matches;
};

/**
 * Predefined hook for detecting mobile devices
 * @returns Boolean indicating if viewport is mobile sized
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 767px)');
};

/**
 * Predefined hook for detecting tablet devices
 * @returns Boolean indicating if viewport is tablet sized
 */
export const useIsTablet = (): boolean => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
};

/**
 * Predefined hook for detecting desktop devices
 * @returns Boolean indicating if viewport is desktop sized
 */
export const useIsDesktop = (): boolean => {
  return useMediaQuery('(min-width: 1024px)');
};

/**
 * Convenience hook for getting device type
 * @returns Object with boolean flags for each device type
 */
export const useDeviceType = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  return {
    isMobile,
    isTablet,
    isDesktop
  };
};
