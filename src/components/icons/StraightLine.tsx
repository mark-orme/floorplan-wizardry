
/**
 * Straight line icon component
 * @module components/icons/StraightLine
 */
import React from 'react';

interface StraightLineProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Straight line icon component
 * Follows lucide-react icon patterns for compatibility
 * @param props Component props
 * @returns Rendered component
 */
export const StraightLine: React.FC<StraightLineProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2
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
    >
      <path d="M5 19L19 5" />
    </svg>
  );
};

export default StraightLine;
