
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  className?: string;
  disabled?: boolean;
}

export const ZoomControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  className,
  disabled = false
}: ZoomControlsProps): JSX.Element => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={disabled || zoom <= 0.25}
      >
        -
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomReset}
        disabled={disabled}
      >
        {Math.round(zoom * 100)}%
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={disabled || zoom >= 4}
      >
        +
      </Button>
    </div>
  );
};
