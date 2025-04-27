
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  className?: string;
  disabled?: boolean;
}

export const Toolbar = ({
  activeTool,
  onToolChange,
  className,
  disabled = false
}: ToolbarProps): JSX.Element => {
  return (
    <div className={cn('flex items-center gap-2 p-2', className)}>
      {Object.values(DrawingMode).map((tool) => (
        <Button
          key={tool}
          variant={activeTool === tool ? 'default' : 'outline'}
          onClick={() => onToolChange(tool)}
          disabled={disabled}
          size="sm"
        >
          {tool}
        </Button>
      ))}
    </div>
  );
};
