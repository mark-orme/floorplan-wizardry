
import React from 'react';
import { Button } from '@/components/ui/button';
import { AiOutlineKey, AiOutlineReload, AiOutlineClockCircle } from 'react-icons/ai';
import { formatRelative } from 'date-fns';

interface SecuritySecretRotationProps {
  lastRotation: string | null;
  onRotate: () => void;
}

export const SecuritySecretRotation = ({ lastRotation, onRotate }: SecuritySecretRotationProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AiOutlineKey size={18} />
        <span>Secret Rotation</span>
      </div>
      {lastRotation && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AiOutlineClockCircle size={16} />
          <span>Last rotated: {formatRelative(new Date(lastRotation), new Date())}</span>
        </div>
      )}
      <Button onClick={onRotate}>
        <AiOutlineReload className="mr-2 h-4 w-4" />
        Rotate Secrets
      </Button>
    </div>
  );
};
