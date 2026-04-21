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
        configure: (proxy, _options) => {
          proxy.on('error', (_err, _req, res) => {
            // Silence the ECONNREFUSED error in the terminal when Vercel is not running locally.
            // Our frontend timerClient already handles the fallback gracefully.
            if ('writeHead' in res) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Proxy backend not running' }));
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

