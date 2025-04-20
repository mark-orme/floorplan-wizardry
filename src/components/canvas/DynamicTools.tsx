import React, { Suspense, lazy } from 'react'; // Added missing Suspense and lazy imports
import { DrawingMode } from '@/constants/drawingModes';
import { Button } from '@/components/ui/button';
import { Calculator, Circle, CircleSquare, Eraser, Hammer, Home, MousePointer, Pencil, Ruler, Square, Type } from 'lucide-react';

// Define a type for the plugin registration
interface CanvasToolPlugin {
  id: string;
  name: string;
  description: string;
  mode: DrawingMode;
  version: string;
  experimental?: boolean;
}

// Define a type for the dynamic tool component
interface DynamicToolProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

// Define a base type for all lazy-loaded components
type LazyComponent<P = any> = React.LazyExoticComponent<React.ComponentType<P>>;

// Define a type for the tool registry entry
interface ToolRegistryEntry {
  component: LazyComponent<DynamicToolProps>;
  plugin: CanvasToolPlugin;
}

// Lazy-load the tool components
const DrawingTools = lazy(() => import('./tools/DrawingTools'));
const BasicShapes = lazy(() => import('./tools/BasicShapes'));
const AdvancedRuler = lazy(() => import('./tools/AdvancedRuler'));
const WallBuilder = lazy(() => import('./tools/WallBuilder'));
const AreaCalculator = lazy(() => import('./tools/AreaCalculator'));
const TextAnnotator = lazy(() => import('./tools/TextAnnotator'));
const ShapeTools = lazy(() => import('./tools/ShapeTools'));

// Define the tool registry
const CanvasToolRegistry: { [key: string]: ToolRegistryEntry } = {
  'drawing-tools': {
    component: DrawingTools,
    plugin: {
      id: 'drawing-tools',
      name: 'Drawing Tools',
      description: 'Basic tools for drawing and selection',
      mode: DrawingMode.SELECT,
      version: '1.0.0'
    }
  },
  'basic-shapes': {
    component: BasicShapes,
    plugin: {
      id: 'basic-shapes',
      name: 'Basic Shapes',
      description: 'Tools for drawing basic shapes',
      mode: DrawingMode.RECTANGLE,
      version: '1.0.0'
    }
  },
  'advanced-ruler': {
    component: AdvancedRuler,
    plugin: {
      id: 'advanced-ruler',
      name: 'Advanced Ruler',
      description: 'Precision measurement tools',
      mode: DrawingMode.MEASURE,
      version: '1.0.0'
    }
  },
  'wall-builder': {
    component: WallBuilder,
    plugin: {
      id: 'wall-builder',
      name: 'Wall Builder',
      description: 'Tools for creating and editing walls',
      mode: DrawingMode.WALL,
      version: '1.0.0'
    }
  },
  'area-calculator': {
    component: AreaCalculator,
    plugin: {
      id: 'area-calculator',
      name: 'Area Calculator',
      description: 'Tools for calculating floor area',
      mode: DrawingMode.ROOM,
      version: '1.0.0',
      experimental: true
    }
  },
  'text-annotator': {
    component: TextAnnotator,
    plugin: {
      id: 'text-annotator',
      name: 'Text Annotator',
      description: 'Tools for adding text to floor plans',
      mode: DrawingMode.TEXT,
      version: '1.0.0'
    }
  },
  'shape-tools': {
    component: ShapeTools,
    plugin: {
      id: 'shape-tools',
      name: 'Shape Tools',
      description: 'Advanced shapes and drawing tools',
      mode: DrawingMode.RECTANGLE,
      version: '1.0.0'
    }
  }
};

export const useDynamicCanvasTools = () => {
  const getRegisteredTools = (): CanvasToolPlugin[] => {
    return Object.values(CanvasToolRegistry).map(entry => entry.plugin);
  };

  const renderTool = (toolId: string, activeTool: DrawingMode, onSelectTool: (tool: DrawingMode) => void): React.ReactNode => {
    const toolEntry = CanvasToolRegistry[toolId];

    if (!toolEntry) {
      return <div>Tool not found.</div>;
    }

    const { component: ToolComponent } = toolEntry;

    return (
      <Suspense key={toolId} fallback={<div>Loading...</div>}>
        <ToolComponent activeTool={activeTool} onSelectTool={onSelectTool} />
      </Suspense>
    );
  };

  return {
    getRegisteredTools,
    renderTool
  };
};
