import React, { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Ruler, Grid, Move, Trash } from 'lucide-react';
import { toast } from 'sonner';

export const StraightLineToolDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [canvasHistory, setCanvasHistory] = useState<any[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8f9fa',
      selection: false
    });
    
    setFabricCanvas(canvas);
    
    // Create grid lines
    const createGrid = () => {
      const gridSize = 20;
      
      // Create grid lines
      for (let i = 0; i < (canvas.width || 800) / gridSize; i++) {
        const lineX = new FabricCanvas.Line([i * gridSize, 0, i * gridSize, canvas.height || 600], {
          stroke: '#dddddd',
          selectable: false,
          evented: false
        });
        canvas.add(lineX);
      }
      
      for (let i = 0; i < (canvas.height || 600) / gridSize; i++) {
        const lineY = new FabricCanvas.Line([0, i * gridSize, canvas.width || 800, i * gridSize], {
          stroke: '#dddddd',
          selectable: false,
          evented: false
        });
        canvas.add(lineY);
      }
      
      canvas.renderAll();
    };
    
    createGrid();
    saveCanvasState(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, []);
  
  // Save canvas state for undo/redo
  const saveCanvasState = (canvas: FabricCanvas | null = fabricCanvas) => {
    if (!canvas) return;
    
    const json = canvas.toJSON(['id', 'data']);
    
    // Add to history, removing any future states if we're not at the end
    setCanvasHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, json];
    });
    setHistoryIndex(prev => prev + 1);
  };
  
  // Undo last action
  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    fabricCanvas.loadFromJSON(canvasHistory[newIndex], () => {
      fabricCanvas.renderAll();
    });
    
    toast.info('Undo successful');
  };
  
  // Redo last undone action
  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= canvasHistory.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    fabricCanvas.loadFromJSON(canvasHistory[newIndex], () => {
      fabricCanvas.renderAll();
    });
    
    toast.info('Redo successful');
  };
  
  // Clear canvas
  const handleClear = () => {
    if (!fabricCanvas) return;
    
    // Keep only grid lines
    const gridLines = fabricCanvas.getObjects().filter(obj => 
      obj.type === 'line' && 
      (obj.stroke === '#dddddd' || obj.strokeWidth === 1)
    );
    
    fabricCanvas.clear();
    
    // Add grid lines back
    gridLines.forEach(line => fabricCanvas.add(line));
    fabricCanvas.renderAll();
    
    saveCanvasState();
    toast.info('Canvas cleared');
  };
  
  // Initialize the straight line tool
  const {
    isEnabled,
    isActive,
    isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles
  } = useStraightLineTool({
    canvas: fabricCanvas,
    enabled: true,
    lineColor,
    lineThickness,
    saveCurrentState: saveCanvasState
  });
  
  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="text-xl font-bold">Straight Line Tool Demo</div>
      
      <div className="flex flex-row space-x-4">
        <div className="flex-1 border rounded-lg shadow-lg overflow-hidden">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
        
        <div className="w-64 flex flex-col space-y-4 p-4 border rounded-lg bg-white">
          <div className="text-lg font-semibold">Drawing Settings</div>
          
          {/* Line color selection */}
          <div className="space-y-2">
            <Label htmlFor="line-color">Line Color</Label>
            <div className="flex space-x-2">
              <input
                id="line-color"
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-10 h-10 rounded"
              />
              <input
                type="text"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
              />
            </div>
          </div>
          
          {/* Line thickness slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="line-thickness">Line Thickness</Label>
              <span className="text-sm">{lineThickness}px</span>
            </div>
            <Slider
              id="line-thickness"
              min={1}
              max={10}
              step={1}
              value={[lineThickness]}
              onValueChange={(values) => setLineThickness(values[0])}
            />
          </div>
          
          {/* Snap to grid toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Grid className="w-4 h-4" />
              <Label htmlFor="snap-grid">Snap to Grid</Label>
            </div>
            <Switch
              id="snap-grid"
              checked={snapEnabled}
              onCheckedChange={toggleGridSnapping}
            />
          </div>
          
          {/* Angle constraints toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4" />
              <Label htmlFor="angle-constraints">Angle Constraints</Label>
            </div>
            <Switch
              id="angle-constraints"
              checked={anglesEnabled}
              onCheckedChange={toggleAngles}
            />
          </div>
          
          {/* Status indicators */}
          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm font-medium">Status</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">Tool Active: 
                <span className={`ml-1 font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {isActive ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="text-sm">Drawing: 
                <span className={`ml-1 font-semibold ${isDrawing ? 'text-green-600' : 'text-gray-600'}`}>
                  {isDrawing ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="text-sm">Input: 
                <span className="ml-1 font-semibold">
                  {inputMethod}
                </span>
              </div>
              <div className="text-sm">Pencil Mode: 
                <span className={`ml-1 font-semibold ${isPencilMode ? 'text-green-600' : 'text-gray-600'}`}>
                  {isPencilMode ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Measurement data */}
          {measurementData.distance !== null && (
            <div className="space-y-2 pt-2 border-t">
              <div className="text-sm font-medium">Measurements</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">Distance: 
                  <span className="ml-1 font-semibold">
                    {Math.round(measurementData.distance)}{measurementData.unit}
                  </span>
                </div>
                {measurementData.angle !== null && (
                  <div className="text-sm">Angle: 
                    <span className="ml-1 font-semibold">
                      {Math.round(measurementData.angle)}°
                    </span>
                  </div>
                )}
                {measurementData.snapped && (
                  <div className="text-sm text-green-600 font-semibold">
                    Snapped
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Canvas controls */}
          <div className="pt-4 space-y-2">
            <div className="text-sm font-medium">Canvas Controls</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
                <RefreshCcw className="w-4 h-4 mr-2 rotate-[-90deg]" />
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex >= canvasHistory.length - 1}>
                <RefreshCcw className="w-4 h-4 mr-2 rotate-90" />
                Redo
              </Button>
              <Button variant="outline" size="sm" onClick={() => {/* Pan implementation */}}>
                <Move className="w-4 h-4 mr-2" />
                Pan
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClear}>
                <Trash className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
