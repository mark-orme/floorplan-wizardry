
import type { InputMethod } from './useLineInputMethod';

export interface UseStraightLineToolProps {
  isActive: boolean;
  isEnabled?: boolean;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  inputMethod?: InputMethod;
}
