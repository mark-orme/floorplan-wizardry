
/// <reference types="vite/client" />

// Allow importing WASM files with ?url suffix
declare module '*.wasm?url' {
  const src: string;
  export default src;
}

// Allow importing WASM files with ?init suffix
declare module '*.wasm?init' {
  const initWasm: (options: WebAssembly.Imports) => Promise<WebAssembly.Instance>;
  export default initWasm;
}
