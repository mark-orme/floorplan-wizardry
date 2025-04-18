
import { useState, useEffect } from 'react';

interface WindowDimensions {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
}

export const useWindowDimensions = (): WindowDimensions => {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: window.innerWidth,
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDimensions({
        width,
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};
