
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { formatRelative } from 'date-fns';

interface SecuritySecretRotationProps {
  lastRotation: string | null;
  onRotate: () => void;
}

export const SecuritySecretRotation = ({ lastRotation, onRotate }: SecuritySecretRotationProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icons.key size={18} />
        <span>Secret Rotation</span>
      </div>
      {lastRotation && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icons.clock size={16} />
          <span>Last rotated: {formatRelative(new Date(lastRotation), new Date())}</span>
        </div>
      )}
      <Button onClick={onRotate}>
        <Icons.refresh className="mr-2 h-4 w-4" />
        Rotate Secrets
      </Button>
    </div>
  );
};
