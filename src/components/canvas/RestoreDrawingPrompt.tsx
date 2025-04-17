
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface RestoreDrawingPromptProps {
  timeElapsed: string;
  onRestore: () => void;
  onDismiss: () => void;
  isRestoring: boolean;
}

export const RestoreDrawingPrompt: React.FC<RestoreDrawingPromptProps> = ({
  timeElapsed,
  onRestore,
  onDismiss,
  isRestoring
}) => {
  const { t } = useTranslation();
  
  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onDismiss()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('canvas.restore.title', 'Restore Previous Drawing?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('canvas.restore.description', 'We found a saved drawing from {{timeElapsed}} ago. Would you like to restore it?', {
              timeElapsed
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRestoring}>
            {t('common.discard', 'Discard')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onRestore}
            disabled={isRestoring}
            className="gap-2"
          >
            {isRestoring && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('canvas.restore.restore', 'Restore Drawing')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
