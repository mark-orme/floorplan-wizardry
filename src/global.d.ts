
// Add missing window property types
interface Window {
  __app_state?: Record<string, unknown>;
  __canvas_state?: Record<string, unknown>;
}
