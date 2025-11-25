import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0", // 외부 접근 허용 (로봇에서 접근 가능하도록)
    port: 5173,
  },
});