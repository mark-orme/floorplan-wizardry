import React, { useState } from 'react';
import { useStraightLineTool } from '@/hooks/straightLineTool';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export const StraightLineToolDemo: React.FC = () => {
  const [snapEnabled, setSnapEnabled] = useState(true);
  
  // Call the hook without arguments
  const straightLineTool = useStraightLineTool();
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Straight Line Tool Demo</h2>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Switch 
            id="snap-toggle"
            checked={snapEnabled}
            onCheckedChange={setSnapEnabled}
          />
          <Label htmlFor="snap-toggle">Enable Grid Snapping</Label>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Start drawing')}
          >
            Start Drawing
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Clear canvas')}
          >
            Clear Canvas
          </Button>
        </div>
      </div>
      
      <div className="w-full h-[300px] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Canvas will render here</p>
      </div>
    </div>
  );
};

export default StraightLineToolDemo;
