
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Start the Vite development server
const viteProcess = spawn('node', ['node_modules/vite/bin/vite.js'], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit'
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
