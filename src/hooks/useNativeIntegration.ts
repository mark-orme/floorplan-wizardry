
import { useEffect, useState } from 'react';

interface NativeCapabilities {
  isNative: boolean;
  hasPressureSensitivity: boolean;
  hasHighRefreshDisplay: boolean;
  deviceModel: string | null;
  isMobileDevice: boolean;
}

export function useNativeIntegration() {
  const [capabilities, setCapabilities] = useState<NativeCapabilities>({
    isNative: false,
    hasPressureSensitivity: false,
    hasHighRefreshDisplay: false,
    deviceModel: null,
    isMobileDevice: false
  });
  
  useEffect(() => {
    // Check if we're running in a native container
    const isNative = 
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'tauri:' ||
      // @ts-ignore
      !!window.Capacitor;
    
    // Check for mobile device
    const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check for pressure sensitivity
    const hasPressureSensitivity = 
      'PointerEvent' in window && 
      'pressure' in PointerEvent.prototype;
    
    // Attempt to detect high refresh rate displays (approximate)
    let hasHighRefreshDisplay = false;
    
    // Try to detect device model
    let deviceModel = null;
    
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      // iOS device detection
      const match = navigator.userAgent.match(/(?:iPhone|iPad|iPod) OS (\d+)_/);
      deviceModel = match ? `iOS ${match[1]}` : 'iOS';
      
      // Recent iPads and iPhones have high refresh displays
      hasHighRefreshDisplay = /iPad Pro|iPhone 13 Pro|iPhone 14 Pro/.test(navigator.userAgent);
    } else if (/Android/.test(navigator.userAgent)) {
      // Android device detection
      const match = navigator.userAgent.match(/Android (\d+)(?:[.;])(\d+)?/);
      deviceModel = match ? `Android ${match[1]}.${match[2] || '0'}` : 'Android';
      
      // Many recent Android flagships have high refresh displays
      hasHighRefreshDisplay = true;
    }
    
    setCapabilities({
      isNative,
      hasPressureSensitivity,
      hasHighRefreshDisplay,
      deviceModel,
      isMobileDevice
    });
    
    // If running natively, set up native optimizations
    if (isNative) {
      console.log('Running in native container, enabling advanced optimizations');
      
      // Register for native events if Capacitor is available
      // @ts-ignore
      if (window.Capacitor) {
        console.log('Capacitor detected, initializing native plugins');
      }
    }
  }, []);
  
  return capabilities;
}
