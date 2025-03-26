
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MeasurementGuideProps {
  onClose: () => void;
}

/**
 * Component that displays a guide for measurement tools and units
 * @param {MeasurementGuideProps} props - Component properties
 * @returns {JSX.Element} Measurement guide component
 */
export const MeasurementGuide = ({ onClose }: MeasurementGuideProps): JSX.Element => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X size={18} />
        </Button>

        <h2 className="text-2xl font-bold mb-4">Measurement Guide</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Drawing Tools</h3>
            <p className="text-gray-700">
              When using the Straight Line or Wall tools, measurements will automatically 
              appear while drawing to show the exact distance.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Grid System</h3>
            <p className="text-gray-700">
              The grid system uses a 10cm (0.1m) small grid and 1m large grid. All measurements 
              are based on real-world units:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Small grid squares = 0.1m (10cm)</li>
              <li>Large grid squares = 1.0m</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Measurement Units</h3>
            <p className="text-gray-700">
              All measurements are shown in meters (m) with one decimal place precision.
              Values in parentheses () show how many 10cm grid squares the line spans.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Tips for Accurate Measurements</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Lines snap to grid points for precision</li>
              <li>Use the zoom in/out tools for detailed work</li>
              <li>Enclosed shapes show their area automatically</li>
              <li>The Select tool allows measuring existing elements</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 text-right">
          <Button onClick={onClose}>Close Guide</Button>
        </div>
      </div>
    </div>
  );
};
