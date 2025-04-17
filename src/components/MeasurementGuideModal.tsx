
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
import { useMeasurementGuide } from '@/hooks/useMeasurementGuide';
import { getMeasurementSystem } from '@/i18n/config';

interface MeasurementGuideModalProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

export function MeasurementGuideModal({ open, onClose }: MeasurementGuideModalProps) {
  const { t } = useTranslation();
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  const measurementSystem = getMeasurementSystem();
  
  const handleClose = () => {
    onClose(dontShowAgain);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t('measurementGuide.title', 'Measurement Guide')}</DialogTitle>
          <DialogDescription>
            {t('measurementGuide.description', 'Learn how measurements work in this floor plan tool.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">{t('measurementGuide.currentSystem', 'Your System')}</h3>
            <p>
              {t('measurementGuide.usingSystem', 'You are currently using the {{system}} system.', {
                system: measurementSystem === 'metric' 
                  ? t('measurementGuide.metric', 'metric') 
                  : t('measurementGuide.imperial', 'imperial')
              })}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">{t('measurementGuide.scale', 'Scale Information')}</h3>
            <p>
              {measurementSystem === 'metric'
                ? t('measurementGuide.metricScale', 'Each grid square represents 1 meter.')
                : t('measurementGuide.imperialScale', 'Each grid square represents 3 feet.')}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">{t('measurementGuide.changingSystem', 'Changing Measurement System')}</h3>
            <p>
              {t('measurementGuide.systemChangeInfo', 'Your measurement system is determined by your language selection. Change the language to switch between metric and imperial.')}
            </p>
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
              {t('measurementGuide.dontShowAgain', "Don't show this again")}
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
