import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow access from other devices in the network
    port: 5173,        // Optional: you can change the port if needed
    open: true,        // Optional: automatically open in browser
  }
})
