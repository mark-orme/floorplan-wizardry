
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { Attribute } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: Attribute | Attribute[];
  forcedTheme?: string;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  themes?: string[];
  systemTheme?: 'light' | 'dark';
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
