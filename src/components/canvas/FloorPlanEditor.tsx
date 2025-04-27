
import React, { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import MeasurementGuideModal component
import MeasurementGuideModal from '@/components/MeasurementGuideModal';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingManager } from './DrawingManager';

// Import FloorPlanCanvas component correctly
import { FloorPlanCanvas } from './FloorPlanCanvas';

interface FloorPlanEditorProps {
  width?: number;
  height?: number;
  onSave?: (data: string) => void;
}

export const FloorPlanEditor: React.FC<FloorPlanEditorProps> = ({
  width = 800,
  height = 600,
  onSave
}) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  // Handle canvas initialization
  const handleCanvasReady = (fabricCanvas: FabricCanvas) => {
    setCanvas(fabricCanvas);
    toast.success('Floor plan editor ready');
  };
  
  // Set up keyboard shortcuts
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTool(DrawingMode.SELECT);
      }
    };
    
    canvas.on('key:down', handleKeyDown);
    canvas.on('mouse:dblclick', () => {});
    canvas.on('selection:created', () => {});
    
    return () => {
      canvas.off('key:down', handleKeyDown);
      canvas.off('mouse:dblclick', () => {});
      canvas.off('selection:created', () => {});
    };
  }, [canvas]);
  
  // Handle save action
  const handleSave = () => {
    if (!canvas || !onSave) return;
    
    const json = JSON.stringify(canvas.toJSON());
    onSave(json);
    toast.success('Floor plan saved');
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="draw" className="w-full">
          <TabsList>
            <TabsTrigger value="draw" onClick={() => setActiveTool(DrawingMode.PENCIL)}>
              Draw
            </TabsTrigger>
            <TabsTrigger value="walls" onClick={() => setActiveTool(DrawingMode.WALL)}>
              Walls
            </TabsTrigger>
            <TabsTrigger value="rooms" onClick={() => setActiveTool(DrawingMode.ROOM)}>
              Rooms
            </TabsTrigger>
            <TabsTrigger value="measure" onClick={() => setActiveTool(DrawingMode.MEASURE)}>
              Measure
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleSave}>Save</Button>
      </div>
      
      <div className="relative">
        <FloorPlanCanvas
          onCanvasError={(error) => toast.error(`Canvas error: ${error.message}`)}
        />
        
        {canvas && (
          <DrawingManager
            canvas={canvas}
            activeTool={activeTool}
            lineColor={lineColor}
            lineThickness={lineThickness}
            showMeasurementGuide={showMeasurementGuide}
            onShowMeasurementGuideChange={setShowMeasurementGuide}
          />
        )}
      </div>
    </div>
  );
};
