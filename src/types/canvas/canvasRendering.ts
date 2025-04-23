
export interface CanvasRendering {
  renderAll: () => void;
  requestRenderAll: () => void;
  renderTop: () => void;
  renderCenter: () => void;
  renderBack: () => void;
  clear: () => void;
  dispose: () => void;
}
