
import React from 'react';

interface MeasurementGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open,
  onClose
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Measurement Guide</h2>
        
        <div className="space-y-4">
          <p>
            To measure distances on the canvas:
          </p>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click and hold at the starting point</li>
            <li>Drag to the end point</li>
            <li>Release to see the measurement</li>
          </ol>
          
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Hold Shift key while measuring to snap to 45° angles.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
