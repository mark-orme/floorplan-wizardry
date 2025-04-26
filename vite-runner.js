
const { exec } = require('child_process');
const path = require('path');

// Start the Vite development server
const viteProcess = exec('node node_modules/vite/bin/vite.js', {
  cwd: process.cwd(),
  env: process.env
});

// Forward stdout and stderr
viteProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

viteProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Handle process exit
viteProcess.on('exit', (code) => {
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  viteProcess.kill('SIGTERM');
});
