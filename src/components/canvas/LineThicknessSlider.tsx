import React from 'react';

interface LineThicknessSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const LineThicknessSlider = ({ value, onChange }: LineThicknessSliderProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue || 1); // Provide a default value if undefined
  };

  return (
    <div className="flex items-center">
      <label htmlFor="lineThickness" className="mr-2 text-sm">
        Thickness:
      </label>
      <input
        type="range"
        id="lineThickness"
        min="1"
        max="20"
        value={value}
        onChange={handleChange}
        className="w-24"
      />
      <span className="ml-2 text-sm">{value}</span>
    </div>
  );
};
