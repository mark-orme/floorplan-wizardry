import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { TextIcon } from 'lucide-react';

interface TextAnnotatorProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const TextAnnotator: React.FC<TextAnnotatorProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Text Annotation</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={activeTool === DrawingMode.TEXT ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.TEXT)}
          className="flex items-center gap-2"
        >
          <TextIcon size={16} />
          Add Text
        </Button>
      </div>
    </div>
  );
};

const plugin = {
  id: 'text-annotator',
  name: 'Text Annotator',
  description: 'Tools for adding text to floor plans',
  mode: DrawingMode.TEXT,
  version: '1.0.0'
};

export default TextAnnotator;
