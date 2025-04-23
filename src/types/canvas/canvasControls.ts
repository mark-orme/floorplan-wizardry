
export interface CanvasControls {
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  grid: {
    visible: boolean;
    size: number;
  };
  snap: {
    enabled: boolean;
    size: number;
  };
}
