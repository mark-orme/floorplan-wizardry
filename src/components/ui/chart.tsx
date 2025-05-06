
import React from "react";
import { cn } from "@/lib/utils";
import ChartTooltip, { ChartTooltipContent } from "./chart/chart-tooltip";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("p-8 bg-secondary rounded-md", className)} ref={ref} {...props}>
        <div className="flex items-center justify-center h-40 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            Chart component requires chart.js and react-chartjs-2 dependencies
          </p>
        </div>
      </div>
    );
  }
);
Chart.displayName = "Chart";

export default Chart;
export { ChartTooltip, ChartTooltipContent };
