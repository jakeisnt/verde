import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/users": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/room": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
