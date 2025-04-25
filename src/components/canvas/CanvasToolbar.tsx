
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  MousePointer,
  Pencil,
  Square,
  Circle,
  Text,
  Eraser,
  Hand,
  ArrowUndo,
  ArrowRedo,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Trash,
  RulerSquare as Ruler,
} from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';

interface DrawingToolbarProps {
  onSave?: () => void;
  onClear?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  onSave,
  onClear,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="drawing-toolbar flex items-center justify-between w-full bg-background p-2 border-b">
      <div className="flex gap-2">
        {/* Condensed toolbar for mobile */}
        {isMobile ? (
          <>
            <Button
              variant="outline" 
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="block md:hidden"
            >
              <Undo className="h-5 w-5" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="block md:hidden"
            >
              <Redo className="h-5 w-5" />
            </Button>
          </>
        ) : (
          // Desktop tooltip version
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex gap-2">
        {/* Always visible buttons regardless of viewport size */}
        {onClear && (
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={onClear}
            className="whitespace-nowrap"
          >
            <Trash className="h-4 w-4 mr-1" />
            {!isMobile && "Clear"}
          </Button>
        )}
        
        {onSave && (
          <Button 
            variant="default" 
            size={isMobile ? "sm" : "default"}
            onClick={onSave}
            className="whitespace-nowrap"
          >
            <Save className="h-4 w-4 mr-1" />
            {!isMobile && "Save"}
          </Button>
        )}
      </div>
    </div>
  );
};
