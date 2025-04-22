
import { InputMethod } from '@/types/input/InputMethod';

/**
 * Options for the straight line tool
 * This interface defines the configuration options for the straight line tool
 */
export interface UseStraightLineToolOptions {
  snapEnabled?: boolean;
  anglesEnabled?: boolean;
  isPencilMode?: boolean;
  inputMethod?: InputMethod;
  lineColor?: string;
  lineThickness?: number;
  isEnabled?: boolean;
  canvas?: any;
  saveCurrentState?: () => void;
}
