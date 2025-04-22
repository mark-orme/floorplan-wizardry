
export {};

declare global {
  interface Window {
    __app_state?: any;
    __canvas_state?: any;
  }
}
