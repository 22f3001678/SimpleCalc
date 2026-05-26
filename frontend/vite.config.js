import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base for GitHub Pages compatibility (repo name SimpleCalc)
export default defineConfig({
  base: '/SimpleCalc/',
  plugins: [react()],
  server: {
    port: 5173
  }
})
