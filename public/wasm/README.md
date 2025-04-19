
# WebAssembly Modules

This directory contains the compiled WebAssembly modules for the application.

## Modules

### Geometry Module (`geometry.wasm`)

This module provides optimized geometry calculations including:

- Polygon area calculation
- Path simplification
- Point-in-polygon testing
- Path optimization

### PDF Module (`pdf.wasm`)

This module provides vector PDF export capabilities:

- Vector drawing export
- Text embedding
- Measurement annotations
- Custom page sizes and orientations

## Development

The source code for these modules is written in C++ and compiled to WebAssembly using Emscripten.

To rebuild the modules, run:

```
npm run build:wasm
```

## Usage

These modules are loaded dynamically when required by the application. For development purposes, if the WASM modules are not available, JavaScript fallbacks will be used.
