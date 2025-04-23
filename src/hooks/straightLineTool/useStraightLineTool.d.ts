
import { Canvas } from 'fabric';

export interface UseStraightLineToolProps {
  isActive: boolean;
  isEnabled?: boolean;
  canvas?: Canvas;
  shiftKeyPressed?: boolean;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  saveCurrentState?: () => void;
}
