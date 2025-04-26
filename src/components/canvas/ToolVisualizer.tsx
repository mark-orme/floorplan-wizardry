
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
  // This component would show visual cues based on the active tool
  // Not fully implemented for simplicity
  return null;
};
