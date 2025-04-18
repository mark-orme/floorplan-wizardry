
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false
    })
  ],
  build: {
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: true
          }
        })
      ],
      output: {
        // Split bundle into smaller chunks
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group core frameworks into one chunk
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            
            // Group UI components 
            if (id.includes('@radix-ui') || id.includes('lucide')) {
              return 'vendor-ui';
            }
            
            // Group utility libraries 
            if (id.includes('fabric') || id.includes('lodash') || id.includes('date-fns')) {
              return 'vendor-utils';
            }

            return 'vendor'; // Other node_modules
          }
          
          // Split app code
          if (id.includes('/components/')) {
            return 'components';
          }
          
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
          
          if (id.includes('/utils/')) {
            return 'utils';
          }
        }
      }
    },
    // Generate analysis files
    reportCompressedSize: true,
    sourcemap: true,
    assetsInlineLimit: 4096
  }
});
