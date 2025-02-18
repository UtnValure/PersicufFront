import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Hace que Vite sea accesible públicamente
    port: process.env.PORT || 4173,

  },
});