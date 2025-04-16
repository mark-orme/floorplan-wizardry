
import React from 'react';

export interface StraightLineProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const StraightLine: React.FC<StraightLineProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      data-testid="straight-line-icon"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
};

export default StraightLine;
