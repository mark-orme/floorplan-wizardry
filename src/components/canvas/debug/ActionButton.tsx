
/**
 * Debug action button component
 * @module components/canvas/debug/ActionButton
 */
import React from 'react';

export interface ActionButtonProps {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'default' | 'warning' | 'danger';
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Debug action button component
 * @param props Component props
 * @returns Rendered component
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'default',
  disabled = false
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-blue-500 hover:bg-blue-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    danger: 'bg-red-500 hover:bg-red-600'
  };
  
  return (
    <button
      className={`px-3 py-1 text-xs text-white rounded ${
        variantStyles[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
