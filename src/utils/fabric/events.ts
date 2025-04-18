
/**
 * iOS-specific event fixes for Fabric.js canvas
 * Addresses touch handling issues specific to iOS devices
 */

/**
 * Apply iOS-specific fixes to canvas element
 * @param canvasElement The canvas DOM element
 * @returns Cleanup function
 */
export function applyIOSEventFixes(canvasElement: HTMLCanvasElement): () => void {
  // Identify iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
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
  
  // Add event listeners with passive: false to prevent default behavior
  canvasElement.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
  document.body.addEventListener('touchmove', preventElasticScroll, { passive: false });
  
  // Add iOS-specific class for additional CSS rules
  canvasElement.classList.add('ios-canvas');
  document.body.classList.add('ios-body');
  
  // Add iOS-specific style to disable selection
  const styleElement = document.createElement('style');
  styleElement.id = 'ios-canvas-fixes';
  styleElement.innerHTML = `
    .ios-canvas {
      -webkit-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
    }
    .ios-body {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Return cleanup function
  return () => {
    canvasElement.removeEventListener('touchend', preventDoubleTapZoom);
    document.body.removeEventListener('touchmove', preventElasticScroll);
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
  if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) return;
  
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
