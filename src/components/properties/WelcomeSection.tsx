
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface WelcomeSectionProps {
  onSignIn: () => void;
  onGoToFloorplans: () => void;
}

export const WelcomeSection = ({ onSignIn, onGoToFloorplans }: WelcomeSectionProps) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-muted/50">
      <h2 className="text-2xl font-bold mb-4">Welcome to Property Management</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Sign in to manage your properties, create floor plans, and more.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onSignIn}>
          <Icons.logIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <Button variant="outline" onClick={onGoToFloorplans}>
          <Icons.arrowRightLeft className="mr-2 h-4 w-4" />
          Go to Floor Plan Editor
        </Button>
      </div>
    </div>
  );
};
