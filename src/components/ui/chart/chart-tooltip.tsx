
import React from "react";
import { cn } from "@/lib/utils";

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ className, ...props }, ref) => {
    return (
      <div 
        className={cn("chart-tooltip bg-background text-foreground p-2 rounded shadow-md", className)} 
        ref={ref} 
        {...props} 
      />
    );
  }
);
ChartTooltip.displayName = "ChartTooltip";

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string | number;
  color?: string;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, title, value, color, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-2", className)} ref={ref} {...props}>
        {color && <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
        <div className="flex gap-1">
          {title && <span className="font-medium">{title}:</span>}
          {value !== undefined && <span>{value}</span>}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartTooltipContent };
export default ChartTooltip;
