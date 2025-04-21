
# Plugin System Architecture

## Overview

The Floor Plan Editor application implements a plugin system to allow for extensibility without modifying core components. This document describes the plugin architecture, extension points, and implementation details.

## Plugin Types

The plugin system supports several types of plugins:

1. **Canvas Tool Plugins**: Add new drawing tools to the canvas
2. **Canvas Object Plugins**: Add new object types to the canvas
3. **Export Format Plugins**: Add new export formats for floor plans
4. **Analysis Plugins**: Add new analysis features for floor plans
5. **UI Extension Plugins**: Add new UI components in designated areas

## Architecture

The plugin system is built on a registry pattern with the following components:

### Plugin Registry

The core of the plugin system is the plugin registry, which manages the registration and discovery of plugins:

```typescript
class PluginRegistry {
  private tools: Map<string, CanvasToolPlugin>;
  private objects: Map<string, CanvasObjectPlugin>;
  private exportFormats: Map<string, ExportFormatPlugin>;
  
  registerTool(tool: CanvasToolPlugin): void;
  registerObject(object: CanvasObjectPlugin): void;
  registerExportFormat(format: ExportFormatPlugin): void;
  
  getTools(): CanvasToolPlugin[];
  getTool(id: string): CanvasToolPlugin | undefined;
  // etc.
}
```

### Extension Points

The application defines several extension points where plugins can hook into the system:

1. **Tool Registration**: Plugins can register new drawing tools
2. **Object Type Registration**: Plugins can register new canvas object types
3. **Export Format Registration**: Plugins can register new export formats
4. **UI Extension Points**: Designated areas in the UI where plugins can render components

### Plugin Interfaces

All plugins must implement specific interfaces that define their behavior:

```typescript
interface CanvasToolPlugin {
  id: string;
  name: string;
  icon: any;
  mode: DrawingMode;
  onActivate: (canvas: FabricCanvas) => void;
  onDeactivate?: (canvas: FabricCanvas) => void;
  // etc.
}

interface CanvasObjectPlugin {
  id: string;
  name: string;
  createObject: (canvas: FabricCanvas, options?: any) => any;
  // etc.
}

interface ExportFormatPlugin {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  exportCanvas: (canvas: FabricCanvas, options?: any) => Promise<Blob | string>;
}
```

## Dynamic Loading

The plugin system supports lazy loading of plugins through dynamic imports:

```typescript
// Register a dynamic import
pluginRegistry.registerDynamicImport(
  'advanced-measurement-tool', 
  () => import('./plugins/measurement-tool')
);

// Load a plugin dynamically
const plugin = await pluginRegistry.loadPlugin('advanced-measurement-tool');
```

## UI Integration

Plugins can integrate with the UI through designated extension points:

```tsx
function ToolbarExtensionPoint() {
  const { getToolbarPlugins } = usePlugins();
  const plugins = getToolbarPlugins();
  
  return (
    <div className="toolbar-extension-point">
      {plugins.map(plugin => (
        <plugin.component key={plugin.id} />
      ))}
    </div>
  );
}
```

## Security and Isolation

Plugins run in the same context as the main application but with some isolation:

1. **Plugin Sandbox**: Plugins run in a restricted environment with limited API access
2. **Capability-based Security**: Plugins receive only the capabilities they need
3. **Event-based Communication**: Plugins communicate with the core through a well-defined event system

## Implementation Example

### Plugin Registration

```typescript
// Register a tool plugin
pluginRegistry.registerTool({
  id: 'circle-tool',
  name: 'Circle Tool',
  icon: CircleIcon,
  mode: DrawingMode.CIRCLE,
  onActivate: (canvas) => {
    // Set up circle drawing mode
  },
  onDeactivate: (canvas) => {
    // Clean up
  }
});
```

### Plugin Usage

```tsx
function ToolSelector() {
  const { getAllTools } = useCanvasTools();
  const tools = getAllTools();
  
  return (
    <div className="tool-selector">
      {tools.map(tool => (
        <ToolButton 
          key={tool.id}
          icon={tool.icon}
          name={tool.name}
          onClick={() => selectTool(tool.mode)}
        />
      ))}
    </div>
  );
}
```

## Creating Custom Plugins

To create a new plugin, developers need to:

1. Implement the appropriate plugin interface
2. Register the plugin with the plugin registry
3. Build and deploy the plugin

## Plugin Lifecycle

Plugins follow a defined lifecycle:

1. **Registration**: Plugin registers with the plugin registry
2. **Initialization**: Plugin is initialized with required dependencies
3. **Activation**: Plugin is activated when used
4. **Deactivation**: Plugin is deactivated when not in use
5. **Disposal**: Plugin cleans up resources when removed

## Third-party Plugin Integration

Third-party plugins can be integrated through:

1. **NPM Packages**: Install plugin packages from npm
2. **Dynamic Loading**: Load plugins from URLs or CDNs
3. **Plugin Marketplace**: Discover and install plugins from a marketplace

## Testing Plugins

The application provides a sandbox environment for testing plugins:

```typescript
// Test a plugin in isolation
function testPlugin(plugin: CanvasToolPlugin) {
  const testCanvas = createTestCanvas();
  plugin.onActivate(testCanvas);
  
  // Perform tests
  expect(testCanvas.getObjects().length).toBe(1);
  
  // Clean up
  plugin.onDeactivate(testCanvas);
}
```
