
declare module 'react-window-mock' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';
  
  export interface ListChildComponentProps {
    index: number;
    style: CSSProperties;
  }
  
  export interface FixedSizeListProps {
    height: number;
    itemCount: number;
    itemSize: number;
    width: number | string;
    className?: string;
    children: ComponentType<ListChildComponentProps>;
  }
  
  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}
