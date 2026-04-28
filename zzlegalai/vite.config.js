import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography"; // ✅ import instead of require

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      plugins: [typography], // ✅ pass directly
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
