
import { ComponentType } from "react";

interface PayloadConfig {
  label: string;
  icon?: ComponentType;
}

type ChartConfig = Record<string, PayloadConfig>;

export const getPayloadConfigFromPayload = (
  config: ChartConfig | undefined,
  payload: any,
  key: string
): PayloadConfig | undefined => {
  if (!config) return undefined;
  
  const configKey = payload.dataKey || key;
  return config[configKey];
};
