
import React from 'react';

interface StraightLineProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const StraightLine: React.FC<StraightLineProps> = ({
  size = 24,
  strokeWidth = 2,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="4" y1="20" x2="20" y2="4" />
    </svg>
  );
};

export default StraightLine;
