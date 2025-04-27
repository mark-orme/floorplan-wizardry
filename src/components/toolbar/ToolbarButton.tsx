
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

export const ToolbarButton = ({
  icon,
  label,
  tooltip,
  onClick,
  active = false,
  disabled = false
}: ToolbarButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={onClick}
            className={active ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            disabled={disabled}
          >
            {icon}
            {label && <span className="ml-1 hidden sm:inline">{label}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
