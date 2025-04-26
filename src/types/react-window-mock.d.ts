
declare module 'react-window-mock' {
  import * as React from 'react';

  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
    data?: any;
  }

  export interface FixedSizeListProps {
    height: number;
    itemCount: number;
    itemSize: number;
    width: string | number;
    className?: string;
    children: (props: ListChildComponentProps) => React.ReactElement;
  }

  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}
