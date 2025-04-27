
import React from 'react';
import { Button } from '@/components/ui/button';

interface ToolbarButtonProps {
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
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      title={tooltip}
      className={active ? "bg-primary text-primary-foreground" : ""}
      disabled={disabled}
    >
      {icon}
      {label && <span className="ml-1 hidden sm:inline">{label}</span>}
    </Button>
  );
};
