
import React from 'react';

interface MeasurementGuideModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open = false,
  onOpenChange = () => {}
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Measurement Guide</h2>
        <p className="mb-4">
          Use the measurement tool to get precise distances between points on your canvas.
          Click to place the first point, then click again to measure the distance.
        </p>
        <ul className="list-disc pl-4 mb-4 space-y-2">
          <li>Hold Shift while measuring to snap to 45° angles</li>
          <li>Press Escape to cancel the current measurement</li>
          <li>Double click to complete a multi-point measurement</li>
        </ul>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={() => onOpenChange(false)}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default MeasurementGuideModal;
