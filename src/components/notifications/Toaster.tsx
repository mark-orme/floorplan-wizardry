
import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster component for displaying notifications
 * Wraps the sonner Toaster with default configuration
 */
export const Toaster: React.FC = () => {
  return (
    <SonnerToaster 
      position="top-right"
      className="border border-border"
    />
  );
};

export default Toaster;
