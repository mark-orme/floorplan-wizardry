
import React from 'react';
import { Button } from '@/components/ui/button';
import { IconMap } from '@/utils/icon-mapper';

interface CalculateAreaButtonProps {
  onClick: () => void;
}

export const CalculateAreaButton: React.FC<CalculateAreaButtonProps> = ({
  onClick
}) => {
  return (
    <Button 
      variant="secondary" 
      className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all bg-white hover:bg-primary/10 border border-primary/20"
      onClick={onClick}
    >
      <IconMap.Calculator className="h-4 w-4" />
      <span>Calculate Area</span>
    </Button>
  );
};
