import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/etomoji_Demo",
  publicDir: "public",
  server: {
    port: 5173,
  },
});
