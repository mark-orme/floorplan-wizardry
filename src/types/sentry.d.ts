
// Type definitions for @sentry/react
declare module '@sentry/react' {
  export function captureMessage(message: string, level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'): string;
  export function captureException(exception: any, captureContext?: any): string;
  export function captureEvent(event: any): string;
  export function setTag(key: string, value: string): void;
  export function setContext(name: string, context: Record<string, any>): void;
  export const withProfiler: any;
  
  // Add any other functions you need from @sentry/react
}
