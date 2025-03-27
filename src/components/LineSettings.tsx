
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

/**
 * Line settings constants
 * @constant {Object}
 */
const LINE_SETTINGS = {
  /**
   * Minimum line thickness in pixels
   * @constant {number}
   */
  MIN_THICKNESS: 1,
  
  /**
   * Maximum line thickness in pixels
   * @constant {number}
   */
  MAX_THICKNESS: 10,
  
  /**
   * Line thickness step size
   * @constant {number}
   */
  THICKNESS_STEP: 1,
  
  /**
   * Default CSS class for slider width
   * @constant {string}
   */
  SLIDER_WIDTH_CLASS: "w-28",
  
  /**
   * Default CSS class for color picker
   * @constant {string}
   */
  COLOR_PICKER_CLASS: "w-8 h-8 p-1 border rounded cursor-pointer"
};

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
          min={LINE_SETTINGS.MIN_THICKNESS}
          max={LINE_SETTINGS.MAX_THICKNESS}
          step={LINE_SETTINGS.THICKNESS_STEP}
          value={[thickness]}
          onValueChange={(values) => onThicknessChange(values[0])}
          className={LINE_SETTINGS.SLIDER_WIDTH_CLASS}
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <Label htmlFor="color" className="text-xs font-medium">Color</Label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className={LINE_SETTINGS.COLOR_PICKER_CLASS}
        />
      </div>
    </div>
  );
};
