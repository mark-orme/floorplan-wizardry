
import React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { ChartConfig, ChartContext } from "./chart-context";

interface ChartContainerProps {
  children: React.ReactNode;
  config?: ChartConfig;
  className?: string;
  aspectRatio?: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  config,
  className,
  aspectRatio = 2
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div 
        className="h-full" 
        style={{ 
          aspectRatio: String(aspectRatio),
          minHeight: '180px'
        }}
      >
        <ChartContext.Provider value={config || {}}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </ChartContext.Provider>
      </div>
    </div>
  );
};
