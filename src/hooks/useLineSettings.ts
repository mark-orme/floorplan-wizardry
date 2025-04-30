
import { useState, useCallback } from 'react';

export interface UseLineSettingsProps {
  initialLineColor?: string;
  initialLineThickness?: number;
}

export const useLineSettings = ({
  initialLineColor = '#000000',
  initialLineThickness = 2
}: UseLineSettingsProps = {}) => {
  const [lineColor, setLineColor] = useState(initialLineColor);
  const [lineThickness, setLineThickness] = useState(initialLineThickness);

  const handleLineColorChange = useCallback((color: string) => {
    setLineColor(color);
  }, []);

  const handleLineThicknessChange = useCallback((thickness: number) => {
    setLineThickness(thickness);
  }, []);

  const applyLineSettings = useCallback(() => {
    // This would be implemented to apply settings to the canvas
    console.log(`Applying settings: color=${lineColor}, thickness=${lineThickness}`);
  }, [lineColor, lineThickness]);

  return {
    lineColor,
    lineThickness,
    setLineColor,
    setLineThickness,
    handleLineColorChange,
    handleLineThicknessChange,
    applyLineSettings
  };
};

export default useLineSettings;
