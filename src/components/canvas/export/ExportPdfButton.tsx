
import React, { useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import PdfExportSettings from './PdfExportSettings';

interface ExportPdfButtonProps {
  canvas: FabricCanvas;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  label?: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  canvas,
  variant = 'default',
  size = 'default',
  className = '',
  label = 'Export PDF'
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowSettings(true)}
      >
        <FileDown className="w-4 h-4 mr-2" />
        {label}
      </Button>
      
      <PdfExportSettings 
        canvas={canvas}
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </>
  );
};

export default ExportPdfButton;
