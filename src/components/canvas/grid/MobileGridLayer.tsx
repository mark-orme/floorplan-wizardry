
import React from 'react';
import { useCanvasContext } from '@/contexts/CanvasContext';
import { GRID_CONSTANTS } from './GridConstants';

interface MobileGridLayerProps {
  className?: string;
}

export const MobileGridLayer: React.FC<MobileGridLayerProps> = ({ className }) => {
  const { canvas } = useCanvasContext();
  const { DEFAULT_GRID_SIZE, DEFAULT_GRID_COLOR, DEFAULT_GRID_OPACITY } = GRID_CONSTANTS;

  const gridStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='${DEFAULT_GRID_SIZE}' height='${DEFAULT_GRID_SIZE}' viewBox='0 0 ${DEFAULT_GRID_SIZE} ${DEFAULT_GRID_SIZE}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${DEFAULT_GRID_COLOR}' fill-opacity='${DEFAULT_GRID_OPACITY}'%3E%3Cpath d='M0 ${DEFAULT_GRID_SIZE}H${DEFAULT_GRID_SIZE}V0H0'/%3E%3C/g%3E%3C/svg%3E")`,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none' as const,
  };

  return (
    <div className={className} style={gridStyle} />
  );
};
