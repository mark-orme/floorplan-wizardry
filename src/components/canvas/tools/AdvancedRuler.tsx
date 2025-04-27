import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { AiOutlineCalculator } from 'react-icons/ai';

interface AdvancedRulerProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const AdvancedRuler: React.FC<AdvancedRulerProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Measurement</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={activeTool === DrawingMode.MEASURE ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.MEASURE)}
          className="flex items-center gap-2"
        >
          <AiOutlineCalculator size={16} />
          Measure
        </Button>
      </div>
    </div>
  );
};

const plugin = {
  id: 'advanced-ruler',
  name: 'Advanced Ruler',
  description: 'Precision measurement tools',
  mode: DrawingMode.MEASURE,
  version: '1.0.0'
};

export default AdvancedRuler;
