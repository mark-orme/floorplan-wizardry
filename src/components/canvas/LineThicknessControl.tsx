import React from 'react';

interface LineThicknessControlProps {
  value: number;
  onChange: (value: number) => void;
}

export const LineThicknessControl = ({ value, onChange }: LineThicknessControlProps) => {
  const handleChange = (newValue: number) => {
    onChange(newValue || 1); // Provide a default value if undefined
  };
  
  return (
    <div>
      <label htmlFor="line-thickness">Line Thickness:</label>
      <input
        type="number"
        id="line-thickness"
        value={value}
        onChange={(e) => handleChange(parseInt(e.target.value, 10))}
        min="1"
        max="20"
      />
    </div>
  );
};
