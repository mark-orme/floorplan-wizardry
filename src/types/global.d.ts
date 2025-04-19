
declare global {
  interface Window {
    __canvas_state: {
      canvasInitialized?: boolean;
      initTime?: number;
      currentTool?: string;
      width?: number;
      height?: number;
      zoom?: number;
      objectCount?: number;
      gridVisible?: boolean;
      lastOperation?: string;
    };
    __app_state?: {
      drawing?: {
        currentTool?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

export {};
