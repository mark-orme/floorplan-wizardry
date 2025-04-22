
import React from "react";
import { useMemo } from "react";
import { useChart, THEMES } from "./chart-context";

interface ChartStyleProps {
  config?: any;
  children: React.ReactNode;
}

export const ChartStyle: React.FC<ChartStyleProps> = ({ config, children }) => {
  const { config: contextConfig } = useChart();
  
  const style = useMemo(() => {
    const configToUse = config?.config || contextConfig?.config;
    if (!configToUse) return {};
    
    const styles: Record<string, any> = {};
    
    Object.entries(configToUse).forEach(([key, value]: [string, any]) => {
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
  }, [config, contextConfig]);
  
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
