
/**
 * Dynamic tool loader component
 * Loads tools on demand based on user interaction
 */
import React, { useState, useEffect } from 'react';
import { DynamicImport, isFeatureEnabled } from '@/utils/dynamicImport';
import { Button } from '@/components/ui/button';
import { pluginRegistry } from '@/packages/plugin-api';
import { Separator } from '@/components/ui/separator';
import { DrawingMode } from '@/constants/drawingModes';

// Lazy-loaded components
const AdvancedRuler = React.lazy(() => import('@/components/canvas/tools/AdvancedRuler'));
const AreaCalculator = React.lazy(() => import('@/components/canvas/tools/AreaCalculator'));
const WallBuilder = React.lazy(() => import('@/components/canvas/tools/WallBuilder'));
const TextAnnotator = React.lazy(() => import('@/components/canvas/tools/TextAnnotator'));
const ShapeTools = React.lazy(() => import('@/components/canvas/tools/ShapeTools'));

interface DynamicToolsProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

export function DynamicTools({ activeTool, onSelectTool }: DynamicToolsProps) {
  const [loadedTools, setLoadedTools] = useState<string[]>([]);
  
  // Load core tools
  useEffect(() => {
    // Always load these core tools
    Promise.all([
      import('@/components/canvas/tools/BasicShapes').then(module => {
        const toolPlugin = module.default;
        pluginRegistry.registerTool(toolPlugin);
        return toolPlugin.id;
      }),
      import('@/components/canvas/tools/DrawingTools').then(module => {
        const toolPlugin = module.default;
        pluginRegistry.registerTool(toolPlugin);
        return toolPlugin.id;
      })
    ])
    .then(toolIds => {
      setLoadedTools(prev => [...prev, ...toolIds]);
    })
    .catch(error => {
      console.error('Failed to load core tools:', error);
    });
  }, []);
  
  // Dynamically load a tool when requested
  const loadTool = async (toolName: string) => {
    if (loadedTools.includes(toolName)) return;
    
    try {
      // Dynamic imports for different tools
      let toolModule;
      
      switch (toolName) {
        case 'advanced-ruler':
          toolModule = await import('@/components/canvas/tools/AdvancedRuler');
          break;
        case 'area-calculator':
          toolModule = await import('@/components/canvas/tools/AreaCalculator');
          break;
        case 'wall-builder':
          toolModule = await import('@/components/canvas/tools/WallBuilder');
          break;
        case 'text-annotator':
          toolModule = await import('@/components/canvas/tools/TextAnnotator');
          break;
        case 'shape-tools':
          toolModule = await import('@/components/canvas/tools/ShapeTools');
          break;
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
      
      // Register the tool plugin
      const toolPlugin = toolModule.default;
      pluginRegistry.registerTool(toolPlugin);
      
      // Mark as loaded
      setLoadedTools(prev => [...prev, toolName]);
      
      // Select the newly loaded tool
      onSelectTool(toolPlugin.mode);
    } catch (error) {
      console.error(`Failed to load tool ${toolName}:`, error);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 p-2">
      <h3 className="text-sm font-medium">Available Tools</h3>
      
      {/* Core tools are always shown */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant={activeTool === DrawingMode.WALL ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.WALL)}
        >
          Wall
        </Button>
        <Button 
          variant={activeTool === DrawingMode.ROOM ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.ROOM)}
        >
          Room
        </Button>
      </div>
      
      <Separator />
      
      {/* Dynamic tools that can be loaded on demand */}
      <h3 className="text-sm font-medium">Additional Tools</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('area-calculator')}
          disabled={!isFeatureEnabled('enableExperimentalTools')}
        >
          Area Calculator
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('advanced-ruler')}
        >
          Ruler
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('wall-builder')}
        >
          Wall Builder
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('text-annotator')}
        >
          Text
        </Button>
      </div>
      
      {/* Render loaded tools */}
      <div className="mt-4">
        {loadedTools.includes('advanced-ruler') && (
          <DynamicImport 
            component={AdvancedRuler} 
            activeTool={activeTool}
            onSelectTool={onSelectTool}
          />
        )}
        
        {loadedTools.includes('area-calculator') && (
          <DynamicImport 
            component={AreaCalculator} 
            activeTool={activeTool}
            onSelectTool={onSelectTool}
          />
        )}
        
        {loadedTools.includes('wall-builder') && (
          <DynamicImport 
            component={WallBuilder} 
            activeTool={activeTool}
            onSelectTool={onSelectTool}
          />
        )}
        
        {loadedTools.includes('text-annotator') && (
          <DynamicImport 
            component={TextAnnotator} 
            activeTool={activeTool}
            onSelectTool={onSelectTool}
          />
        )}
        
        {loadedTools.includes('shape-tools') && (
          <DynamicImport 
            component={ShapeTools} 
            activeTool={activeTool}
            onSelectTool={onSelectTool}
          />
        )}
      </div>
    </div>
  );
}

export default DynamicTools;
