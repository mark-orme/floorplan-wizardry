
import React from 'react';
import { XCircle } from 'lucide-react';

interface RestoreDrawingPromptProps {
  timeElapsed: string;
  onRestore: () => void;
  onDismiss: () => void;
  isRestoring?: boolean;
}

/**
 * Prompt to restore previously unsaved drawing
 */
export const RestoreDrawingPrompt: React.FC<RestoreDrawingPromptProps> = ({
  timeElapsed,
  onRestore,
  onDismiss,
  isRestoring = false
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md border border-gray-200 dark:border-gray-700 animate-fade-in z-50">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">Restore unsaved drawing?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            We found a drawing from {timeElapsed}. Would you like to restore it?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onRestore}
              disabled={isRestoring}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </button>
            <button
              onClick={onDismiss}
              disabled={isRestoring}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          aria-label="Close"
        >
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
};
