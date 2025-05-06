import { useState, useCallback } from 'react';

export const useToolOperations = () => {
  const [tool, setTool] = useState<string | null>('select');

  const updateTool = useCallback((tool: string | null) => {
    // Use default tool if null
    const safeTool = tool || 'select'; // Default to select tool if null
    setTool(safeTool);
  }, []);

  return {
    tool,
    updateTool
  };
};
