
declare module '@sentry/react' {
  /** allow the old API to compile */
  export function addBreadcrumb(b: any): void;
}
