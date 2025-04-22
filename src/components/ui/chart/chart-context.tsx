
import * as React from "react";

export interface ChartConfig {
  config?: Record<string, {
    label: string;
    icon?: React.ComponentType;
    theme?: string;
    color?: string;
  }>;
}

export const THEMES = {
  light: {
    backgroundColor: '#ffffff',
    primaryColor: '#0284c7',
    secondaryColor: '#0ea5e9',
    textColor: '#1e293b'
  },
  dark: {
    backgroundColor: '#1e293b',
    primaryColor: '#38bdf8',
    secondaryColor: '#7dd3fc',
    textColor: '#f8fafc'
  }
};

export const ChartContext = React.createContext<ChartConfig>({});

export const ChartProvider = ({ children, value }: { children: React.ReactNode, value: ChartConfig }) => {
  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
};

export const useChart = () => React.useContext(ChartContext);
