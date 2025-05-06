
import React from 'react';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  formatter?: (value: number, name: string, props: any) => [string, string];
  labelFormatter?: (label: string) => string;
  config?: {
    title?: string;
    showColorIndicator?: boolean;
    showValue?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
    valueFormatter?: (value: number) => string;
  };
}

export const CustomTooltip: React.FC<TooltipProps> = ({ 
  active, 
  payload, 
  label, 
  formatter, 
  labelFormatter,
  config
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  const defaultConfig = {
    showColorIndicator: true,
    showValue: true,
    valuePrefix: '',
    valueSuffix: '',
  };
  
  // Merge with default config
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Format label if formatter provided
  const formattedLabel = labelFormatter ? labelFormatter(label || '') : label;
  
  return (
    <div className="bg-white p-2 shadow-md rounded border border-gray-200 max-w-xs">
      {mergedConfig.title && (
        <div className="font-medium text-gray-700 mb-1">{mergedConfig.title}</div>
      )}
      
      {formattedLabel && (
        <div className="text-sm text-gray-600 mb-2">{formattedLabel}</div>
      )}
      
      <div className="space-y-1">
        {payload.map((item: any, index: number) => {
          const value = item.value;
          const name = item.name || item.dataKey;
          const color = item.color || '#888';
          
          // Format value if formatter exists
          let displayValue = value;
          if (formatter) {
            const [formattedValue] = formatter(value, name, item);
            displayValue = formattedValue;
          } else if (mergedConfig.valueFormatter) {
            displayValue = mergedConfig.valueFormatter(value);
          }
          
          return (
            <div key={`item-${index}`} className="flex items-center justify-between">
              <div className="flex items-center">
                {mergedConfig.showColorIndicator && (
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-sm text-gray-700">{name}</span>
              </div>
              
              {mergedConfig.showValue && (
                <span className="text-sm font-medium">
                  {mergedConfig.valuePrefix}
                  {displayValue}
                  {mergedConfig.valueSuffix}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTooltip;
