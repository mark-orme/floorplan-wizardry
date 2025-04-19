
/**
 * WebAssembly build script
 * 
 * This script copies the placeholder WASM modules to the build directory
 * In a real project, this would compile the actual WASM modules
 */

const fs = require('fs');
const path = require('path');

// Source and destination paths
const wasmSrcDir = path.resolve(__dirname, '../public/wasm');
const wasmDestDir = path.resolve(__dirname, '../dist/wasm');

// Create destination directory if it doesn't exist
if (!fs.existsSync(wasmDestDir)) {
  fs.mkdirSync(wasmDestDir, { recursive: true });
  console.log(`Created directory: ${wasmDestDir}`);
}

// Copy the WASM modules
fs.readdirSync(wasmSrcDir).forEach(file => {
  // Only copy .wasm files
  if (file.endsWith('.wasm')) {
    const srcPath = path.join(wasmSrcDir, file);
    const destPath = path.join(wasmDestDir, file);
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${destPath}`);
  }
});

console.log('WASM modules prepared successfully!');
