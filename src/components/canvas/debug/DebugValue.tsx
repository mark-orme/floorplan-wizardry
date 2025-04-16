
/**
 * Debug value component
 * @module components/canvas/debug/DebugValue
 */
import React from 'react';

export interface DebugValueProps {
  /** Value label */
  label: string;
  /** Value to display */
  value: string | number | boolean | null | undefined;
  /** Whether the value is important */
  important?: boolean;
}

/**
 * Debug value component
 * @param props Component props
 * @returns Rendered component
 */
export const DebugValue: React.FC<DebugValueProps> = ({
  label,
  value,
  important = false
}) => {
  // Format value for display
  let displayValue: string;
  let valueClass = '';
  
  if (value === undefined) {
    displayValue = 'undefined';
    valueClass = 'text-gray-400';
  } else if (value === null) {
    displayValue = 'null';
    valueClass = 'text-gray-400';
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'true' : 'false';
    valueClass = value ? 'text-green-600' : 'text-red-600';
  } else if (typeof value === 'number') {
    displayValue = value.toString();
    valueClass = 'text-blue-600';
  } else {
    displayValue = value.toString();
  }
  
  return (
    <div className="flex justify-between py-1">
      <span className={`text-gray-600 ${important ? 'font-medium' : ''}`}>
        {label}:
      </span>
      <span className={valueClass}>
        {displayValue}
      </span>
    </div>
  );
};
