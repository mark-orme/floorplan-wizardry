
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Paintbrush } from "lucide-react";

export interface LineSettingsProps {
  thickness: number;
  color: string;
  onThicknessChange: (thickness: number) => void;
  onColorChange: (color: string) => void;
}

export const LineSettings = ({
  thickness,
  color,
  onThicknessChange,
  onColorChange
}: LineSettingsProps) => {
  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#0000FF", // Blue
    "#008000", // Green
    "#800080", // Purple
    "#FFA500", // Orange
    "#A52A2A", // Brown
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="thickness" className="text-xs">Line width:</Label>
        <Slider
          id="thickness"
          min={1}
          max={5}
          step={1}
          value={[thickness]}
          onValueChange={(values) => onThicknessChange(values[0])}
          className="w-24"
        />
        <span className="text-xs font-mono">{thickness}px</span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            <span className="sr-only">Pick a color</span>
            <Paintbrush className="h-4 w-4" style={{ color }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-1">
            {colors.map((c) => (
              <div
                key={c}
                className="w-6 h-6 rounded-full cursor-pointer border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                onClick={() => onColorChange(c)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
