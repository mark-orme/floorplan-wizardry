
export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onReady?: (canvas: any) => void;
  onError?: (error: Error) => void;
}
