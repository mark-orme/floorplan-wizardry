
import React from "react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Palette } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface LineSettingsProps {
  thickness: number;
  color: string;
  onThicknessChange: (value: number) => void;
  onColorChange: (color: string) => void;
}

const COLOR_OPTIONS = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#008000" },
  { name: "Orange", value: "#FFA500" },
  { name: "Purple", value: "#800080" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Gray", value: "#808080" },
];

export const LineSettings = ({
  thickness,
  color,
  onThicknessChange,
  onColorChange,
}: LineSettingsProps) => {
  const handleThicknessChange = (value: number[]) => {
    onThicknessChange(value[0]);
  };

  return (
    <div className="flex flex-col gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
      <div>
        <Label htmlFor="line-thickness" className="text-sm font-medium mb-2 block">
          Line Thickness: {thickness}px
        </Label>
        <Slider
          id="line-thickness"
          min={1}
          max={10}
          step={1}
          value={[thickness]}
          onValueChange={handleThicknessChange}
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Line Color</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {COLOR_OPTIONS.map((colorOption) => (
            <HoverCard key={colorOption.value}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  onClick={() => onColorChange(colorOption.value)}
                  className={`w-6 h-6 rounded-full ${
                    color === colorOption.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  aria-label={`${colorOption.name} color`}
                />
              </HoverCardTrigger>
              <HoverCardContent className="p-2 text-sm shadow-md">
                {colorOption.name}
              </HoverCardContent>
            </HoverCard>
          ))}
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="w-6 h-6 rounded-full flex items-center justify-center bg-white border border-gray-300"
                aria-label="Custom color"
              >
                <Palette className="w-4 h-4" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <label>
                Custom Color
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="block mt-1 w-full cursor-pointer"
                />
              </label>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};
