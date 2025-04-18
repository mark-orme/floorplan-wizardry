
import React from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  itemHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 40,
  maxHeight = 400,
  className = ''
}: VirtualizedListProps<T>) {
  const listHeight = Math.min(items.length * itemHeight, maxHeight);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden" style={{ height: listHeight }}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <FixedSizeList
            height={listHeight}
            itemCount={items.length}
            itemSize={itemHeight}
            width={width}
            className={`scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 ${className}`}
          >
            {({ index, style }) => renderItem(items[index], index, style)}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}
