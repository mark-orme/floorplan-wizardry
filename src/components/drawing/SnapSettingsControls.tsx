
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SnapSettingsControlsProps {
  snapEnabled: boolean;
  anglesEnabled: boolean;
  toggleSnap: () => void;
  toggleAngles: () => void;
}

export const SnapSettingsControls: React.FC<SnapSettingsControlsProps> = ({
  snapEnabled,
  anglesEnabled,
  toggleSnap,
  toggleAngles
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={snapEnabled ? "default" : "outline"}
              size="icon"
              onClick={toggleSnap}
              className={snapEnabled ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{snapEnabled ? "Disable" : "Enable"} Snap to Grid</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={anglesEnabled ? "default" : "outline"}
              size="icon"
              onClick={toggleAngles}
              className={anglesEnabled ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{anglesEnabled ? "Disable" : "Enable"} Angle Constraints</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
