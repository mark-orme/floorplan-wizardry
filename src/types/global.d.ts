
/**
 * Global type definitions
 */

// Extend Window interface with app-specific globals
interface Window {
  // Global app state for Sentry and debugging
  __app_state?: {
    drawing?: {
      currentTool?: string;
      lineColor?: string;
      lineThickness?: number;
      snapEnabled?: boolean;
    };
    user?: {
      id?: string;
      role?: string;
    };
  };
  
  // Canvas state for debugging and error reporting
  __canvas_state?: {
    width?: number;
    height?: number;
    zoom?: number;
    objectCount?: number;
    gridVisible?: boolean;
    lastOperation?: string;
  };

  // For debugging purposes - temporary reference to canvas instance
  fabricCanvas?: any;
}
