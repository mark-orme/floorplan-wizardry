
export interface TransferableCanvasState {
  data: any;
  transferables: any[];
}

export function createTransferableCanvasState(canvasJson: any): TransferableCanvasState {
  return {
    data: canvasJson,
    transferables: []
  };
}
