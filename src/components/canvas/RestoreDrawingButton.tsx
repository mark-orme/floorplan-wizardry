
import React from "react";
import { RestoreDrawingPrompt } from "./RestoreDrawingPrompt";
import { trackCanvasOperation } from "@/utils/sentry/userInteractions";

interface RestoreDrawingButtonProps {
  showPrompt: boolean;
  timeElapsed: string;
  isRestoring: boolean;
  onRestore: () => void;
  onDismiss: () => void;
}

export const RestoreDrawingButton: React.FC<RestoreDrawingButtonProps> = ({
  showPrompt,
  timeElapsed,
  isRestoring,
  onRestore,
  onDismiss
}) => {
  const handleRestore = () => {
    trackCanvasOperation('restored', { timeElapsed });
    onRestore();
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <RestoreDrawingPrompt
      timeElapsed={timeElapsed}
      onRestore={handleRestore}
      onDismiss={onDismiss}
      isRestoring={isRestoring}
    />
  );
};
