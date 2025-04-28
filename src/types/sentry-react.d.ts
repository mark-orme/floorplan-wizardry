
declare module '@sentry/react' {
  /** Allow the old API to compile */
  export function addBreadcrumb(breadcrumb: any): void;
  
  /** Additional legacy API helpers */
  export function captureMessage(message: string, options?: any): void;
  export function captureException(error: Error, options?: any): void;
}
