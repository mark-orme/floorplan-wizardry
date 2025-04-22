
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolVisualizerProps {
  tool: DrawingMode;
  isApplePencil: boolean;
}

export const ToolVisualizer: React.FC<ToolVisualizerProps> = ({
  tool,
  isApplePencil
}) => {
  // This component would render a visual indicator of the current tool
  // For now, we'll just return null
  return null;
};
