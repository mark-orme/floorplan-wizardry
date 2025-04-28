
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Core DrawingTool interface
 */
export interface DrawingTool {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  mode: DrawingMode;
  active?: boolean;
  disabled?: boolean;
  shortcut?: string;
  tooltip?: string;
  description?: string;
  groupId?: string;
}
