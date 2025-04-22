
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '5fd3156d-6e2b-49c7-9a87-b3c12127f790.lovableproject.com'
    ]
  }
});
