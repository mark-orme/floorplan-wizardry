import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Ruler, Info, Grid, ArrowUpDown } from "lucide-react";

interface MeasurementGuideModalProps {
  open: boolean;
  onClose?: (dontShowAgain: boolean) => void;
  onOpenChange?: (open: boolean) => void;
}

export function MeasurementGuideModal({ open, onClose, onOpenChange }: MeasurementGuideModalProps) {
  const { t } = useTranslation();
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  const measurementSystem = 'metric'; // Default to metric, can be expanded later
  
  const handleClose = () => {
    if (onClose) {
      onClose(dontShowAgain);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
    
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {t('measurementGuide.title', 'Measurement Guide')}
          </DialogTitle>
          <DialogDescription>
            {t('measurementGuide.description', 'Learn how measurements and scaling work in this drawing tool.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2 bg-slate-50 p-4 rounded-md">
            <h3 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t('measurementGuide.currentSystem', 'Your System')}
            </h3>
            <p>
              {t('measurementGuide.usingSystem', 'You are currently using the {{system}} system.', {
                system: measurementSystem === 'metric' 
                  ? t('measurementGuide.metric', 'metric') 
                  : t('measurementGuide.imperial', 'imperial')
              })}
            </p>
          </div>
          
          <div className="space-y-2 border border-gray-200 p-4 rounded-md">
            <h3 className="font-medium flex items-center gap-2">
              <Grid className="h-4 w-4" />
              {t('measurementGuide.scale', 'Scale Information')}
            </h3>
            <p>
              {measurementSystem === 'metric'
                ? t('measurementGuide.metricScale', 'Each grid square represents 1 meter, with minor grid lines showing 10cm increments.')
                : t('measurementGuide.imperialScale', 'Each grid square represents 3 feet, with minor grid lines showing 6-inch increments.')}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <div className="h-3 w-6 border border-gray-300"></div>
              <span>{measurementSystem === 'metric' ? '= 1 meter' : '= 3 feet'}</span>
            </div>
          </div>
          
          <div className="space-y-2 bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {t('measurementGuide.drawing', 'Drawing Guidelines')}
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>{t('measurementGuide.straightLine', 'Straight lines are automatically detected when drawing')}</li>
              <li>{t('measurementGuide.snapGrid', 'Lines will snap to the grid when close enough')}</li>
              <li>{t('measurementGuide.smoothing', 'Path smoothing eliminates small jitters in your drawing')}</li>
            </ul>
          </div>
          
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dont-show-again"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('measurementGuide.dontShowAgain', "Don't show this guide again")}
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose}>
            {t('common.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
