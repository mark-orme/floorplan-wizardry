
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
      toastOptions={{
        style: { background: 'var(--background)', color: 'var(--foreground)' },
        className: 'border border-border',
        // Modern sonner API uses closeButton boolean property
        closeButton: true
      }}
    />
  );
};

export default Toaster;
