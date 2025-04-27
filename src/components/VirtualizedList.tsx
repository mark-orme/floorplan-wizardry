
import React from 'react';

interface VirtualizedListProps<T> {
  data: T[];
  height: number;
  rowHeight: number;
  renderRow: (item: T) => React.ReactNode;
}

function VirtualizedList<T>({ data, height, rowHeight, renderRow }: VirtualizedListProps<T>) {
  return (
    <div style={{ height, overflowY: 'auto' }}>
      {data.map((item, index) => (
        <div key={index} style={{ height: rowHeight }}>
          {renderRow(item)}
        </div>
      ))}
    </div>
  );
}

export default VirtualizedList;
