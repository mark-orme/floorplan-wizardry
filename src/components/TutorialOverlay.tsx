
import React, { useEffect, useState } from 'react';
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
import type { TutorialStep } from '@/hooks/useTutorial';

interface TutorialOverlayProps { 
  isOpen: boolean;
  onClose: () => void;
  currentStep?: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  steps: TutorialStep[];
}

export function TutorialOverlay({ 
  isOpen, 
  onClose,
  currentStep = 0,
  onNextStep,
  onPrevStep,
  steps 
}: TutorialOverlayProps) {
  const { t } = useTranslation();
  const currentTutorialStep = steps[currentStep];
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    if (currentTutorialStep?.targetSelector) {
      const element = document.querySelector(currentTutorialStep.targetSelector);
      if (element instanceof HTMLElement) {
        setTargetElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tutorial-highlight');
      }
    }
    
    return () => {
      if (targetElement) {
        targetElement.classList.remove('tutorial-highlight');
      }
    };
  }, [currentTutorialStep, currentStep]);

  const dialogOffset = targetElement?.getBoundingClientRect() || null;
  const placement = currentTutorialStep?.placement || 'center';
  
  const dialogStyle = dialogOffset ? {
    position: 'absolute' as const,
    ...getDialogPosition(dialogOffset, placement)
  } : {};
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent 
        className="sm:max-w-md tutorial-dialog" 
        style={dialogStyle}
      >
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

function getDialogPosition(targetRect: DOMRect, placement: string) {
  const padding = 16;
  
  switch (placement) {
    case 'top':
      return {
        bottom: `${window.innerHeight - targetRect.top + padding}px`,
        left: `${targetRect.left + (targetRect.width / 2)}px`,
        transform: 'translateX(-50%)'
      };
    case 'bottom':
      return {
        top: `${targetRect.bottom + padding}px`,
        left: `${targetRect.left + (targetRect.width / 2)}px`,
        transform: 'translateX(-50%)'
      };
    case 'left':
      return {
        top: `${targetRect.top + (targetRect.height / 2)}px`,
        right: `${window.innerWidth - targetRect.left + padding}px`,
        transform: 'translateY(-50%)'
      };
    case 'right':
      return {
        top: `${targetRect.top + (targetRect.height / 2)}px`,
        left: `${targetRect.right + padding}px`,
        transform: 'translateY(-50%)'
      };
    default:
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
  }
}
