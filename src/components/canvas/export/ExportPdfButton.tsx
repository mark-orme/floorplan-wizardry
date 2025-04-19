
/**
 * Export PDF Button Component
 * @module components/canvas/export/ExportPdfButton
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Canvas as FabricCanvas } from 'fabric';
import { PdfExportSettings } from './PdfExportSettings';
import { FileDown } from 'lucide-react';

interface ExportPdfButtonProps {
  /** Canvas to export */
  canvas: FabricCanvas | null;
  /** Button variant */
  variant?: 'default' | 'outline' | 'secondary';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button to export canvas as PDF
 */
export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  canvas,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <>
      <Button
        onClick={() => setShowSettings(true)}
        variant={variant}
        size={size}
        className={className}
        disabled={!canvas}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      
      <PdfExportSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        canvas={canvas}
      />
    </>
  );
};
