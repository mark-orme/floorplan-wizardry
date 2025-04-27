
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2Icon } from "lucide-react";

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
  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <Alert className="bg-white shadow-lg border-blue-200">
        <AlertTitle className="text-lg font-semibold">Restore your drawing?</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">
            We found an unsaved drawing from {timeElapsed} ago. Would you like to restore it?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onDismiss} disabled={isRestoring}>
              Discard
            </Button>
            <Button onClick={onRestore} disabled={isRestoring}>
              {isRestoring ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                "Restore"
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
