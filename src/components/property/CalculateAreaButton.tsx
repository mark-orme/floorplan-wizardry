
import React from 'react';

interface CalculateAreaButtonProps {
  onClick: () => void;
}

export const CalculateAreaButton: React.FC<CalculateAreaButtonProps> = ({ onClick }) => {
  return (
    <button
      className="absolute bottom-4 right-4 bg-white rounded-md shadow-md px-3 py-1 text-sm font-medium z-10"
      onClick={onClick}
    >
      Calculate Area
    </button>
  );
};
