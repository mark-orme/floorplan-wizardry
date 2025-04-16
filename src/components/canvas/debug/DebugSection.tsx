
/**
 * Debug section component
 * @module components/canvas/debug/DebugSection
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface DebugSectionProps {
  /** Section title */
  title: string;
  /** Section children */
  children: React.ReactNode;
  /** Whether the section is expanded by default */
  defaultExpanded?: boolean;
}

/**
 * Debug section component
 * @param props Component props
 * @returns Rendered component
 */
export const DebugSection: React.FC<DebugSectionProps> = ({
  title,
  children,
  defaultExpanded = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-left hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="mr-1 h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="mr-1 h-4 w-4 text-gray-500" />
        )}
        {title}
      </button>
      {expanded && (
        <div className="px-3 py-2 text-sm bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};
