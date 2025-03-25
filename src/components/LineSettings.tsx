
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export interface LineSettingsProps {
  thickness: number;
  color: string;
  onThicknessChange: (thickness: number) => void;
  onColorChange: (color: string) => void;
}

/**
 * Component for adjusting line thickness and color in the drawing toolbar
 */
export const LineSettings = ({
  thickness,
  color,
  onThicknessChange,
  onColorChange
}: LineSettingsProps) => {
  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded border">
      <div className="flex flex-col gap-1">
        <Label htmlFor="thickness" className="text-xs font-medium">Thickness: {thickness}px</Label>
        <Slider
          id="thickness"
          min={1}
          max={10}
          step={1}
          value={[thickness]}
          onValueChange={(values) => onThicknessChange(values[0])}
          className="w-28"
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <Label htmlFor="color" className="text-xs font-medium">Color</Label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 p-1 border rounded cursor-pointer"
        />
      </div>
    </div>
  );
};
