
import React from "react";
import { useMemo } from "react";
import { ChartConfig, THEMES } from "./chart-context";

interface ChartStyleProps {
  config?: ChartConfig;
  children: React.ReactNode;
}

export const ChartStyle: React.FC<ChartStyleProps> = ({ config, children }) => {
  const style = useMemo(() => {
    if (!config || !config.config) return {};
    
    const styles: Record<string, any> = {};
    
    Object.entries(config.config).forEach(([key, value]) => {
      if (value.theme && THEMES[value.theme as keyof typeof THEMES]) {
        styles[`.${key}`] = { 
          fill: THEMES[value.theme as keyof typeof THEMES].primaryColor 
        };
      }
      
      if (value.color) {
        styles[`.${key}`] = { 
          ...styles[`.${key}`], 
          fill: value.color 
        };
      }
    });
    
    return styles;
  }, [config]);
  
  if (Object.keys(style).length === 0) {
    return <>{children}</>;
  }
  
  return (
    <>
      <style>
        {Object.entries(style).map(([selector, props]) => {
          return `${selector} { ${Object.entries(props).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }`;
        }).join('\n')}
      </style>
      {children}
    </>
  );
};
