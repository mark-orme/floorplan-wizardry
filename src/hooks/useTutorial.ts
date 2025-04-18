
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useTutorial() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: t('tutorial.welcome.title', 'Welcome to Floor Plan Creator!'),
      description: t('tutorial.welcome.description', 'Let\'s walk through the main features of the application.'),
    },
    {
      title: t('tutorial.tools.title', 'Drawing Tools'),
      description: t('tutorial.tools.description', 'Use these tools to create walls, draw lines, and modify your floor plan.'),
      targetSelector: '.drawing-toolbar'
    },
    {
      title: t('tutorial.shortcuts.title', 'Keyboard Shortcuts'),
      description: t('tutorial.shortcuts.description', 'Press "Ctrl + Z" to undo, "Ctrl + Y" to redo, and "Delete" to remove selected elements.'),
    },
    {
      title: t('tutorial.collaboration.title', 'Real-time Collaboration'),
      description: t('tutorial.collaboration.description', 'Multiple users can work on the same floor plan simultaneously. Changes sync automatically.'),
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

  return {
    isOpen,
    currentStep,
    steps,
    startTutorial,
    nextStep,
    prevStep,
    closeTutorial
  };
}
