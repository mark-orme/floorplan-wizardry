
/**
 * iOS-specific event fixes for Fabric.js canvas
 * Addresses touch handling issues specific to iOS devices
 */

/**
 * Check if current device is running iOS
 * @returns boolean indicating if the device is running iOS
 */
export function isIOSPlatform(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Apply iOS-specific fixes to canvas element
 * @param canvasElement The canvas DOM element
 * @returns Cleanup function
 */
export function applyIOSEventFixes(canvasElement: HTMLCanvasElement): () => void {
  // Identify iOS devices
  const isIOS = isIOSPlatform();
  
  if (!isIOS) return () => {};
  
  // iOS-specific fix: prevent double-tap zoom
  const preventDoubleTapZoom = (e: TouchEvent) => {
    // Prevent double-tap from zooming
    if (e.touches.length === 1) {
      e.preventDefault();
    }
  };
  
  // iOS-specific fix: prevent elastic scrolling/bounce
  const preventElasticScroll = (e: TouchEvent) => {
    e.preventDefault();
  };
  
  // iOS-specific fix: prevent document level gestures
  const preventGestures = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent pinch-zoom at document level
    }
  };
  
  // Add event listeners with passive: false to prevent default behavior
  canvasElement.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
  document.body.addEventListener('touchmove', preventElasticScroll, { passive: false });
  document.addEventListener('gesturestart', preventGestures as any, { passive: false });
  document.addEventListener('gesturechange', preventGestures as any, { passive: false });
  
  // Add iOS-specific class for additional CSS rules
  canvasElement.classList.add('ios-canvas');
  document.body.classList.add('ios-body');
  
  // Add iOS-specific style to disable selection and improve touch handling
  const styleElement = document.createElement('style');
  styleElement.id = 'ios-canvas-fixes';
  styleElement.innerHTML = `
    .ios-canvas {
      -webkit-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      touch-action: none;
    }
    .ios-body {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
      overscroll-behavior: none;
    }
    
    /* Prevent all default touch behaviors on iOS */
    body * {
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Return cleanup function
  return () => {
    canvasElement.removeEventListener('touchend', preventDoubleTapZoom);
    document.body.removeEventListener('touchmove', preventElasticScroll);
    document.removeEventListener('gesturestart', preventGestures as any);
    document.removeEventListener('gesturechange', preventGestures as any);
    canvasElement.classList.remove('ios-canvas');
    document.body.classList.remove('ios-body');
    const style = document.getElementById('ios-canvas-fixes');
    if (style) {
      style.remove();
    }
  };
}

/**
 * Add iOS-specific touch event handlers
 * @param canvas Fabric.js canvas instance
 */
export function addIOSTouchHandlers(canvas: any) {
  // Only apply on iOS devices
  if (!isIOSPlatform()) return;
  
  const originalTouchStart = canvas.__onTouchStart;
  const originalTouchMove = canvas.__onTouchMove;
  const originalTouchEnd = canvas.__onTouchEnd;
  
  // Override touch start to improve responsiveness
  canvas.__onTouchStart = function(e: TouchEvent) {
    e.preventDefault();
    originalTouchStart.call(this, e);
  };
  
  // Override touch move with debouncing to prevent lag
  let lastMoveTime = 0;
  canvas.__onTouchMove = function(e: TouchEvent) {
    e.preventDefault();
    
    // Simple throttling to improve performance
    const now = Date.now();
    if (now - lastMoveTime > 16) { // ~60fps
      originalTouchMove.call(this, e);
      lastMoveTime = now;
    }
  };
  
  // Override touch end to ensure proper cleanup
  canvas.__onTouchEnd = function(e: TouchEvent) {
    e.preventDefault();
    originalTouchEnd.call(this, e);
  };
}
