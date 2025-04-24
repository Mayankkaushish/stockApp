import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js", // ✅ Ensures Tailwind & PostCSS are used correctly
  },
  define: {
    "process.env": {}, // ✅ Keep this if needed, but can be removed if not used
  },
  resolve: {
    alias: {
      // ✅ Add module aliases here if needed
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
