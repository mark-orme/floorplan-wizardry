import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/constants/icons';
import { formatRelative } from 'date-fns';

interface SecuritySecretRotationProps {
  lastRotation: string | null;
  onRotate: () => void;
}

export const SecuritySecretRotation = ({ lastRotation, onRotate }: SecuritySecretRotationProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icons.Key />
        <span>Secret Rotation</span>
      </div>
      {lastRotation && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icons.Clock />
          <span>Last rotated: {formatRelative(new Date(lastRotation), new Date())}</span>
        </div>
      )}
      <Button onClick={onRotate}>
        <Icons.Reload className="mr-2" />
        Rotate Secrets
      </Button>
    </div>
  );
};
