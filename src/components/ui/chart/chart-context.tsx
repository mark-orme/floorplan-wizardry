
import * as React from "react";

export interface ChartContextValue {
  config?: Record<string, {
    label: string;
    icon?: React.ComponentType;
  }>;
}

const ChartContext = React.createContext<ChartContextValue>({});

export const ChartProvider = ChartContext.Provider;

export const useChart = () => React.useContext(ChartContext);
