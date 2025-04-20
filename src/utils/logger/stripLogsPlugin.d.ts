
/**
 * Type definitions for stripLogsPlugin
 */
interface StripLogsPluginOptions {
  include?: string[];
}

/**
 * Rollup/Vite plugin to strip debug logs in production
 * @param options - Plugin options
 * @returns Rollup plugin
 */
declare function stripLogsPlugin(options?: StripLogsPluginOptions): {
  name: string;
  transform(code: string, id: string): { code: string; map: null } | null;
};

export default stripLogsPlugin;
