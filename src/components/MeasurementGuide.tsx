
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface MeasurementGuideProps {
  onClose: () => void;
}

/**
 * Guide for floor plan measurements
 * @param {MeasurementGuideProps} props - Component properties
 * @returns {JSX.Element} MeasurementGuide component
 */
export const MeasurementGuide: React.FC<MeasurementGuideProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Floor Plan Measurement Guide</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <section>
            <h3 className="font-semibold text-lg mb-2">Drawing to Scale</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Each grid square represents 0.1 meters (10 cm)</li>
              <li>Large grid lines appear every 1 meter</li>
              <li>Measurements are automatically displayed while drawing</li>
            </ul>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg mb-2">Drawing Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the straight line tool for precise wall measurements</li>
              <li>Lines automatically snap to the grid for accuracy</li>
              <li>Close shapes completely to measure room areas</li>
              <li>Use the select tool to adjust existing elements</li>
            </ul>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg mb-2">Gross Internal Area (GIA)</h3>
            <p>GIA is calculated automatically based on the closed areas in your floor plan. It represents the total usable internal floor area.</p>
          </section>

          <section className="pt-2">
            <Button onClick={onClose} className="w-full">
              Got it
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
