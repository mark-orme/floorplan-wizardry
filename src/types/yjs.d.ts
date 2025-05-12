
/**
 * Temporary type definitions for yjs
 * These will need to be replaced with proper typings
 */

declare module 'yjs' {
  export class Doc {
    constructor();
    getArray(name: string): YArray<any>;
    getMap(name: string): YMap<any>;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
  }

  export class YArray<T> {
    push(item: T): void;
    insert(index: number, content: T[]): void;
    delete(index: number, length: number): void;
    toArray(): T[];
    observe(callback: Function): void;
  }

  export class YMap<T> {
    set(key: string, value: T): void;
    get(key: string): T | undefined;
    delete(key: string): void;
    toJSON(): Record<string, T>;
    observe(callback: Function): void;
  }

  export function encodeStateAsUpdate(doc: Doc): Uint8Array;
  export function applyUpdate(doc: Doc, update: Uint8Array): void;
}

declare module 'yjs-reactjs-hooks' {
  import { Doc, YArray, YMap } from 'yjs';
  export function useYjs<T>(doc: Doc, name: string): [T[], (updater: (items: T[]) => void) => void];
  export function useYjsMap<T>(doc: Doc, name: string): [Record<string, T>, (updater: (items: Record<string, T>) => void) => void];
  export function useYjsProvider(options: { url: string }): { provider: any, doc: Doc };
}
