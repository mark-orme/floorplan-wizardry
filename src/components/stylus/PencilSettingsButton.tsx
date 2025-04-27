
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PencilCalibrationDialog } from './PencilSettingsScreen';
import { AiOutlineEdit } from 'react-icons/ai';

interface PencilSettingsButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

export function PencilSettingsButton({ variant = 'outline', className }: PencilSettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <AiOutlineEdit className="h-4 w-4 mr-2" />
        Pencil Settings
      </Button>
      
      <PencilCalibrationDialog
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
