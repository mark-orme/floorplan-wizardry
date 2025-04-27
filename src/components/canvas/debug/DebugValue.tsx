
import React from 'react';

interface DebugValueProps {
  label: string;
  value: any;
  important?: boolean;
}

export const DebugValue: React.FC<DebugValueProps> = ({
  label,
  value,
  important = false
}) => {
  const getDisplayValue = () => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).substring(0, 30);
      } catch (e) {
        return '[Object]';
      }
    }
    return String(value);
  };

  return (
    <div className="flex justify-between text-xs">
      <span className={`font-medium ${important ? 'text-blue-600' : 'text-gray-700'}`}>
        {label}:
      </span>
      <span className={important ? 'font-semibold text-blue-700' : 'text-gray-600'}>
        {getDisplayValue()}
      </span>
    </div>
  );
};
