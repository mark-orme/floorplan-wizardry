
import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Line, Circle } from 'fabric';
import { useEnhancedGridSnapping } from '../hooks/straightLineTool/useEnhancedGridSnapping';
import { Button } from '../components/ui/button';
import { Grid } from 'lucide-react';

const meta = {
  title: 'Hooks/useEnhancedGridSnapping',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A hook that provides enhanced grid snapping functionality for canvas drawing.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo component to show grid snapping
const GridSnappingDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: '#f8f9fa',
    });
    
    // Draw grid lines
    const gridSize = 20;
    for (let i = 0; i <= 400; i += gridSize) {
      fabricCanvas.add(new Line([i, 0, i, 400], {
        stroke: '#e9ecef',
        selectable: false,
        evented: false,
      }));
      fabricCanvas.add(new Line([0, i, 400, i], {
        stroke: '#e9ecef',
        selectable: false,
        evented: false,
      }));
    }
    
    setCanvas(fabricCanvas);
    fabricCanvasRef.current = fabricCanvas;
    
    return () => {
      fabricCanvas.dispose();
    };
  }, []);
  
  // Use grid snapping hook - pass arguments correctly
  const { snapEnabled, toggleGridSnapping, snapToGrid } = useEnhancedGridSnapping({
    initialSnapEnabled: true,
    gridSize: 20,
    snapThreshold: 10
  });
  
  // Add a point when clicking on the canvas
  const addPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const point = snapEnabled ? snapToGrid({ x, y }) : { x, y };
    
    const circle = new Circle({
      left: point.x - 5,
      top: point.y - 5,
      radius: 5,
      fill: snapEnabled ? 'green' : 'red',
      selectable: true,
    });
    
    canvas.add(circle);
    canvas.renderAll();
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full px-4">
        <p className="text-sm font-medium">
          Grid Snapping: <span className={snapEnabled ? "text-green-600" : "text-red-600"}>
            {snapEnabled ? "Enabled" : "Disabled"}
          </span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleGridSnapping}
          className="flex items-center gap-2"
        >
          {snapEnabled ? (
            <>
              <Grid className="h-4 w-4" />
              Disable Grid
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              Enable Grid
            </>
          )}
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <canvas 
          ref={canvasRef} 
          onClick={addPoint}
          className="cursor-crosshair"
        />
      </div>
      
      <p className="text-sm text-gray-500">
        Click on the canvas to place points. {snapEnabled ? "Points will snap to the grid." : "Points will be placed exactly where you click."}
      </p>
    </div>
  );
};

export const GridSnappingExample: Story = {
  render: () => <GridSnappingDemo />,
};
