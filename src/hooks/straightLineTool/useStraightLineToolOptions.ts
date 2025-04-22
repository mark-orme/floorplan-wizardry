
/**
 * Options for the straight line tool
 * This interface defines the configuration options for the straight line tool
 */
export interface UseStraightLineToolOptions {
  snapEnabled?: boolean;
  anglesEnabled?: boolean;
  isPencilMode?: boolean;
  inputMethod?: 'mouse' | 'touch' | 'pointer';
  lineColor?: string;
  lineThickness?: number;
  isActive?: boolean;
  saveCurrentState?: () => void;
}
