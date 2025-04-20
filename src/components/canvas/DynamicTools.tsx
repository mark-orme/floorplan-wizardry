
/**
 * Dynamic tool loader component
 * Loads tools on demand based on user interaction
 */
import React, { useState, useEffect } from 'react';
import { isFeatureEnabled, DynamicImport } from '@/utils/dynamicImport';
import { Button } from '@/components/ui/button';
import { pluginRegistry } from '@/packages/plugin-api';
import { Separator } from '@/components/ui/separator';
import { DrawingMode } from '@/constants/drawingModes';
import { Loader2 } from 'lucide-react';

// Tool components will be lazy-loaded
const LazyLoadingPlaceholder = () => (
  <div className="p-2 flex justify-center">
    <Loader2 className="animate-spin h-4 w-4" />
  </div>
);

interface DynamicToolsProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

export function DynamicTools({ activeTool, onSelectTool }: DynamicToolsProps) {
  const [loadedTools, setLoadedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Load core tools
  useEffect(() => {
    // Load essential tools on mount
    Promise.all([
      import('./tools/BasicShapes').then(module => {
        const toolPlugin = module.default;
        pluginRegistry.registerTool(toolPlugin);
        return toolPlugin.id;
      }),
      import('./tools/DrawingTools').then(module => {
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
    
    setIsLoading(toolName);
    
    try {
      // Dynamic imports for different tools
      let toolModule;
      
      switch (toolName) {
        case 'advanced-ruler':
          toolModule = await import('./tools/AdvancedRuler');
          break;
        case 'area-calculator':
          toolModule = await import('./tools/AreaCalculator');
          break;
        case 'wall-builder':
          toolModule = await import('./tools/WallBuilder');
          break;
        case 'text-annotator':
          toolModule = await import('./tools/TextAnnotator');
          break;
        case 'shape-tools':
          toolModule = await import('./tools/ShapeTools');
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
    } finally {
      setIsLoading(null);
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
          disabled={!isFeatureEnabled('enableExperimentalTools') || isLoading === 'area-calculator'}
        >
          {isLoading === 'area-calculator' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Area Calculator
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('advanced-ruler')}
          disabled={isLoading === 'advanced-ruler'}
        >
          {isLoading === 'advanced-ruler' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Ruler
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('wall-builder')}
          disabled={isLoading === 'wall-builder'}
        >
          {isLoading === 'wall-builder' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Wall Builder
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadTool('text-annotator')}
          disabled={isLoading === 'text-annotator'}
        >
          {isLoading === 'text-annotator' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Text
        </Button>
      </div>
      
      {/* Render loaded tools */}
      <div className="mt-4">
        {loadedTools.includes('advanced-ruler') && (
          <Suspense fallback={<LazyLoadingPlaceholder />}>
            <DynamicImport 
              component={React.lazy(() => import('./tools/AdvancedRuler'))}
              activeTool={activeTool}
              onSelectTool={onSelectTool}
            />
          </Suspense>
        )}
        
        {loadedTools.includes('area-calculator') && (
          <Suspense fallback={<LazyLoadingPlaceholder />}>
            <DynamicImport 
              component={React.lazy(() => import('./tools/AreaCalculator'))}
              activeTool={activeTool}
              onSelectTool={onSelectTool}
            />
          </Suspense>
        )}
        
        {loadedTools.includes('wall-builder') && (
          <Suspense fallback={<LazyLoadingPlaceholder />}>
            <DynamicImport 
              component={React.lazy(() => import('./tools/WallBuilder'))}
              activeTool={activeTool}
              onSelectTool={onSelectTool}
            />
          </Suspense>
        )}
        
        {loadedTools.includes('text-annotator') && (
          <Suspense fallback={<LazyLoadingPlaceholder />}>
            <DynamicImport 
              component={React.lazy(() => import('./tools/TextAnnotator'))}
              activeTool={activeTool}
              onSelectTool={onSelectTool}
            />
          </Suspense>
        )}
        
        {loadedTools.includes('shape-tools') && (
          <Suspense fallback={<LazyLoadingPlaceholder />}>
            <DynamicImport 
              component={React.lazy(() => import('./tools/ShapeTools'))}
              activeTool={activeTool}
              onSelectTool={onSelectTool}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default DynamicTools;
