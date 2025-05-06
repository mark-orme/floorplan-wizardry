
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PencilSettingsScreen, PencilCalibrationDialog } from './PencilSettingsScreen';

interface PencilSettingsButtonProps {
  minPressure: number;
  maxPressure: number;
  color: string;
  width: number;
  setMinPressure: (value: number) => void;
  setMaxPressure: (value: number) => void;
  setColor: (color: string) => void;
  setWidth: (width: number) => void;
}

export const PencilSettingsButton: React.FC<PencilSettingsButtonProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
      >
        Pencil Settings
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Pencil Settings</h3>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
            <PencilSettingsScreen {...props} />
            <div className="p-4 border-t flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PencilSettingsButton;
