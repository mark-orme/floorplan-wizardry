
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarItemProps {
  label?: string;
  icon: React.ReactNode;
  tooltip?: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export const ToolbarItem: React.FC<ToolbarItemProps> = ({
  label,
  icon,
  tooltip,
  active = false,
  onClick,
  disabled = false,
  danger = false
}) => {
  const button = (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        ${danger ? 'text-red-500 hover:text-red-600' : ''}
        ${active ? 'bg-primary text-primary-foreground' : ''}
      `}
    >
      {icon}
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
