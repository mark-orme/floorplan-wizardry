
declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      trailing?: boolean;
      maxWait?: number;
    }
  ): T & { cancel: () => void };

  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      trailing?: boolean;
    }
  ): T & { cancel: () => void };

  export function clamp(number: number, lower?: number, upper?: number): number;
  export function isEqual(value: any, other: any): boolean;
  export function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
  export function cloneDeep<T>(value: T): T;
}
