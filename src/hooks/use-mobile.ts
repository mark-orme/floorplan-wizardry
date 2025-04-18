
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * @returns boolean indicating if the current device is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkMobile = () => {
      // Check if device is mobile based on screen width and/or user agent
      const isMobileByWidth = window.innerWidth < 768;
      const isMobileByAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(isMobileByWidth || isMobileByAgent);
    };
    
    // Check immediately
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
}
