
declare module 'react-window-mock' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';
  
  export interface ListChildComponentProps<T = any> {
    index: number;
    style: CSSProperties;
    data: T;
  }
  
  export interface FixedSizeListProps<T = any> {
    height: number;
    itemCount: number;
    itemSize: number;
    width: number | string;
    className?: string;
    children: ComponentType<ListChildComponentProps<T>>;
    itemData?: T;
  }
  
  export class FixedSizeList<T = any> extends React.Component<FixedSizeListProps<T>> {}
}
