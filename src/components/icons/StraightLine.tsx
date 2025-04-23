
import React from 'react';

interface StraightLineProps {
  className?: string;
  size?: number;
  color?: string;
}

export const StraightLine: React.FC<StraightLineProps> = ({
  className = '',
  size = 24,
  color = 'currentColor'
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 20L21 4" />
    </svg>
  );
};

export default StraightLine;
