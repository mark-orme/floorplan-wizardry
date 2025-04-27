
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { AiOutlineAreaChart } from 'react-icons/ai';

interface AreaCalculatorProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const AreaCalculator: React.FC<AreaCalculatorProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Area Tools</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={activeTool === DrawingMode.ROOM ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.ROOM)}
          className="flex items-center gap-2"
        >
          <AiOutlineAreaChart size={16} />
          Calculate Area
        </Button>
      </div>
    </div>
  );
};

const plugin = {
  id: 'area-calculator',
  name: 'Area Calculator',
  description: 'Tools for area measurement',
  mode: DrawingMode.ROOM,
  version: '1.0.0'
};

export default AreaCalculator;
