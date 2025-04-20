
/**
 * Plugin API for extending canvas functionality
 * 
 * This module provides a framework for registering and loading canvas tools, 
 * object types, and export formats without modifying core code.
 * 
 * @module plugin-api
 */

import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Tool plugin definition
export interface CanvasToolPlugin {
  /** Unique identifier for the tool */
  id: string;
  
  /** Display name for the tool */
  name: string;
  
  /** Icon to show in toolbar (component or icon name) */
  icon: any;
  
  /** Drawing mode this tool provides */
  mode: DrawingMode;
  
  /** Tooltip text for the tool */
  tooltip?: string;
  
  /** Handler called when tool is activated */
  onActivate: (canvas: FabricCanvas) => void;
  
  /** Handler called when tool is deactivated */
  onDeactivate?: (canvas: FabricCanvas) => void;
  
  /** Tool keyboard shortcut */
  shortcut?: string;
  
  /** Mouse handler for tool */
  mouseHandler?: (event: MouseEvent, canvas: FabricCanvas) => void;
  
  /** Whether tool is enabled */
  isEnabled?: (canvas: FabricCanvas) => boolean;
}

// Object type plugin definition
export interface CanvasObjectPlugin {
  /** Unique identifier for the object type */
  id: string;
  
  /** Display name for the object type */
  name: string;
  
  /** Factory function to create a new object */
  createObject: (canvas: FabricCanvas, options?: any) => any;
  
  /** Function to render object controls */
  renderControls?: (object: any, canvas: FabricCanvas) => JSX.Element;
  
  /** Function to export object data */
  exportObject?: (object: any) => any;
  
  /** Function to import object data */
  importObject?: (data: any, canvas: FabricCanvas) => any;
}

// Export format plugin definition
export interface ExportFormatPlugin {
  /** Unique identifier for export format */
  id: string;
  
  /** Display name for export format */
  name: string;
  
  /** File extension for export format */
  extension: string;
  
  /** MIME type for export format */
  mimeType: string;
  
  /** Function to export canvas to format */
  exportCanvas: (canvas: FabricCanvas, options?: any) => Promise<Blob | string>;
}

// Plugin registry to store all registered plugins
class PluginRegistry {
  private tools: Map<string, CanvasToolPlugin> = new Map();
  private objects: Map<string, CanvasObjectPlugin> = new Map();
  private exportFormats: Map<string, ExportFormatPlugin> = new Map();
  private dynamicImports: Map<string, () => Promise<any>> = new Map();
  
  // Tool registration
  registerTool(tool: CanvasToolPlugin): void {
    this.tools.set(tool.id, tool);
  }
  
  // Object registration
  registerObject(object: CanvasObjectPlugin): void {
    this.objects.set(object.id, object);
  }
  
  // Export format registration
  registerExportFormat(format: ExportFormatPlugin): void {
    this.exportFormats.set(format.id, format);
  }
  
  // Register a dynamic import for lazy loading
  registerDynamicImport(id: string, importFn: () => Promise<any>): void {
    this.dynamicImports.set(id, importFn);
  }
  
  // Get all registered tools
  getTools(): CanvasToolPlugin[] {
    return Array.from(this.tools.values());
  }
  
  // Get a specific tool by ID
  getTool(id: string): CanvasToolPlugin | undefined {
    return this.tools.get(id);
  }
  
  // Get all registered object types
  getObjects(): CanvasObjectPlugin[] {
    return Array.from(this.objects.values());
  }
  
  // Get a specific object type by ID
  getObject(id: string): CanvasObjectPlugin | undefined {
    return this.objects.get(id);
  }
  
  // Get all registered export formats
  getExportFormats(): ExportFormatPlugin[] {
    return Array.from(this.exportFormats.values());
  }
  
  // Get a specific export format by ID
  getExportFormat(id: string): ExportFormatPlugin | undefined {
    return this.exportFormats.get(id);
  }
  
  // Dynamically load a plugin
  async loadPlugin(id: string): Promise<any> {
    const importFn = this.dynamicImports.get(id);
    if (!importFn) {
      throw new Error(`Plugin ${id} not found`);
    }
    
    try {
      const module = await importFn();
      return module.default || module;
    } catch (error) {
      console.error(`Failed to load plugin ${id}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
export const pluginRegistry = new PluginRegistry();

// Hook for using tools in components
export function useCanvasTools() {
  return {
    getAllTools: pluginRegistry.getTools.bind(pluginRegistry),
    getTool: pluginRegistry.getTool.bind(pluginRegistry)
  };
}

// Hook for using object types in components
export function useCanvasObjects() {
  return {
    getAllObjects: pluginRegistry.getObjects.bind(pluginRegistry),
    getObject: pluginRegistry.getObject.bind(pluginRegistry)
  };
}

// Hook for using export formats in components
export function useExportFormats() {
  return {
    getAllExportFormats: pluginRegistry.getExportFormats.bind(pluginRegistry),
    getExportFormat: pluginRegistry.getExportFormat.bind(pluginRegistry)
  };
}

// Helper for dynamically loading plugins
export function loadPluginDynamically(id: string) {
  return pluginRegistry.loadPlugin(id);
}
