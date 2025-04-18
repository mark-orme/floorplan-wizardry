
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  targetSelector?: string;
}

export function TutorialOverlay({ 
  isOpen, 
  onClose,
  currentStep = 0,
  onNextStep,
  onPrevStep,
  steps 
}: { 
  isOpen: boolean;
  onClose: () => void;
  currentStep?: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  steps: TutorialStep[];
}) {
  const { t } = useTranslation();
  const currentTutorialStep = steps[currentStep];
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentTutorialStep.title}</DialogTitle>
          <DialogDescription>
            {currentTutorialStep.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onPrevStep}
            disabled={currentStep === 0}
          >
            {t('common.previous')}
          </Button>
          <Button
            onClick={currentStep === steps.length - 1 ? onClose : onNextStep}
          >
            {currentStep === steps.length - 1 ? t('common.finish') : t('common.next')}
          </Button>
        </div>
        <Button
          className="absolute top-4 right-4"
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
