
/**
 * @deprecated Import from '@/hooks/straightLineTool/useStraightLineTool' instead
 */

// Export MeasurementData for other hooks that need it
export interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped: boolean;
  unit: string;
  startPoint?: any;
  endPoint?: any;
  snapType?: 'grid' | 'angle' | 'both';
}

// Re-export from the new location for backward compatibility
export { useStraightLineTool } from './useStraightLineTool.tsx';

// Export types
export type { MeasurementData };
