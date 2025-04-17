
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MeasurementGuideModalProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementGuideModal = ({ 
  open, 
  onClose, 
  onOpenChange 
}: MeasurementGuideModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Measurement Guide</DialogTitle>
          <DialogDescription>
            <div className="space-y-4 mt-4">
              <h3 className="font-medium">Drawing Scale</h3>
              <p>1 grid square = 1 meter</p>
              
              <h3 className="font-medium">Tips for Accurate Measurements</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the grid snap feature for precise drawings</li>
                <li>Double-click to end a line</li>
                <li>Hold Shift for perfect straight lines</li>
                <li>Use the measure tool to verify distances</li>
              </ul>
              
              <h3 className="font-medium">Area Calculation</h3>
              <p>Close shapes to automatically calculate room areas</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
