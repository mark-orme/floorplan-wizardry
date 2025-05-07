
import React from "react";
import { cn } from "@/lib/utils";

export interface ChartTooltipProps {
  className?: string;
  children: React.ReactNode;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div 
      className={cn(
        "absolute pointer-events-none p-2 bg-white dark:bg-gray-950 rounded-md shadow border border-border text-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ChartTooltipContentProps {
  label?: string;
  value?: string | number;
  formattedValue?: string;
  color?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  label,
  value,
  formattedValue,
  color
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <p className="font-medium">{label}</p>}
      <div className="flex items-center gap-2">
        {color && (
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
        )}
        <p>{formattedValue || value}</p>
      </div>
    </div>
  );
};

export default ChartTooltip;
