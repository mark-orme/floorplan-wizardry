
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { Attribute } from "next-themes/types"  // Changed from 'next-themes/dist/types'

// Define ThemeProviderProps interface here with the correct attribute type
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: Attribute | Attribute[];
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
