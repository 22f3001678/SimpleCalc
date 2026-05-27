import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE || './';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 4173,
    open: true,
    cors: true,
  },
  build: {
    // Emit a manifest and use hashed asset filenames (Vite default) to support cache-busting
    manifest: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
});
