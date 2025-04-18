
import React from 'react';

interface LineIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const LineIcon: React.FC<LineIconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
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
      <path d="M5 19l14-14"/>
    </svg>
  );
};

export default LineIcon;
