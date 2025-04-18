
import React from 'react';

export interface StraightLineProps {
  className?: string;
  size?: number;
}

export const StraightLine: React.FC<StraightLineProps> = ({ className, size = 24 }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
};
