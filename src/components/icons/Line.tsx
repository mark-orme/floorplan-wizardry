
import React from 'react';

export const Line = ({ size = 24, ...props }: { size?: number, [key: string]: any }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
};

// Make lucide-react compatible
Line.displayName = "Line";
