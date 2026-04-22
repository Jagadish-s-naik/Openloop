import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // Check if it's a connection refused error
            if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
              if (res && 'writeHead' in res) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  error: 'Proxy backend not running', 
                  message: 'Local development server not detected. Using client-side fallback.' 
                }));
              }
              return; // Prevent Vite from logging the error to terminal
            }
          });
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
            if (id.includes('gsap')) return 'gsap-vendor';
            return 'vendor';
          }
        }
      }

    },
    chunkSizeWarningLimit: 1000,
  }
})

