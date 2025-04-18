
import { useEffect, useState } from 'react';

/**
 * Hook to detect iOS devices
 * @returns Whether the current device is running iOS
 */
export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|mac/.test(userAgent);
    
    // For iPad with iPadOS, the user agent can be misleading
    // Testing for touch events and screen size helps detect iPads
    const hasTouch = 'ontouchend' in document;
    
    setIsIOS(isApple || (hasTouch && navigator.maxTouchPoints > 1));
    
    // Add iOS-specific class to body for CSS targeting
    if (isApple || (hasTouch && navigator.maxTouchPoints > 1)) {
      document.body.classList.add('ios-device');
    }
  }, []);
  
  return isIOS;
}
