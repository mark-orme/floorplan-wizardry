
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
  }
}

export {};
