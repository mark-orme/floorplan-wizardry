
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface TutorialStep {
  title: string;
  description: string;
  targetSelector?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export function useTutorial() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: t('tutorial.welcome.title', 'Welcome to Floor Plan Creator!'),
      description: t('tutorial.welcome.description', 'Let\'s walk through the main features of the application.'),
      placement: 'center'
    },
    {
      title: t('tutorial.tools.title', 'Drawing Tools'),
      description: t('tutorial.tools.description', 'Use these tools to create walls, draw lines, and modify your floor plan.'),
      targetSelector: '.drawing-toolbar',
      placement: 'bottom'
    },
    {
      title: t('tutorial.shortcuts.title', 'Keyboard Shortcuts'),
      description: t('tutorial.shortcuts.description', 'Press "Ctrl + Z" to undo, "Ctrl + Y" to redo, and "Delete" to remove selected elements. Use Shift while drawing for straight lines.'),
      targetSelector: '.canvas-container',
      placement: 'top'
    },
    {
      title: t('tutorial.collaboration.title', 'Real-time Collaboration'),
      description: t('tutorial.collaboration.description', 'Multiple users can work on the same floor plan simultaneously. Changes sync automatically.'),
      targetSelector: '.collaboration-toggle',
      placement: 'left'
    },
    {
      title: t('tutorial.drawing.title', 'Drawing Walls'),
      description: t('tutorial.drawing.description', 'Select the wall tool and click to start drawing. Click again to finish. Hold Shift for perfect angles.'),
      targetSelector: '.wall-tool',
      placement: 'right'
    },
    {
      title: t('tutorial.measurements.title', 'Measurements'),
      description: t('tutorial.measurements.description', 'As you draw, measurements will appear to help you create accurate floor plans.'),
      targetSelector: '.measurement-display',
      placement: 'top'
    }
  ];

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const closeTutorial = useCallback(() => {
    setIsOpen(false);
    setCurrentStep(0);
  }, []);

  const skipToStep = useCallback((step: number) => {
    setCurrentStep(Math.min(Math.max(0, step), steps.length - 1));
  }, [steps.length]);

  return {
    isOpen,
    currentStep,
    steps,
    startTutorial,
    nextStep,
    prevStep,
    closeTutorial,
    skipToStep
  };
}
