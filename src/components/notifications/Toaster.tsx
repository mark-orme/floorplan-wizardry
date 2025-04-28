
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
      theme="light"
      duration={5000}
      // Styling is applied directly, not through toastOptions
      style={{ background: "white", color: "black" }}
    />
  );
};

export default Toaster;
