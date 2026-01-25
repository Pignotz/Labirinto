import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config dev server
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // porta del dev server
    proxy: {
      // qualsiasi chiamata a /api va al backend Spring Boot su localhost:8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
